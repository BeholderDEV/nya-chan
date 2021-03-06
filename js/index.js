(function () {
  var app = angular.module('nya-chan', ['angular-loading-bar', 'ngImgCrop', 'ngCookies', 'vcRecaptcha', 'toastr'])
  .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false
  }])

  function base64ToBlob (base64, mime) {
    mime = mime || ''
    var sliceSize = 1024
    var byteChars = window.atob(base64)
    var byteArrays = []

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      var slice = byteChars.slice(offset, offset + sliceSize)
      var byteNumbers = new Array(slice.length)
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      var byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }
    return new Blob(byteArrays, {type: mime})
  }

  app.controller('indexController', function ($scope, $http, $cookies, $cookieStore, vcRecaptchaService, toastr) {
    $scope.init = function () {
      $scope.isUserLogged = false
      $scope.isUserAdmin = false
      if ($cookies.get('user') !== undefined) {
        var user = JSON.parse($cookies.get('user'))
        $scope.userName = user.login
        $scope.userImage = user.avatar
        $scope.isUserLogged = true
        $scope.isUserAdmin = user.role === 'admin'
      }
    }

    $scope.myImage = ''
    $scope.myCroppedImage = ''
    $scope.response = null
    $scope.widgetId = null

    $scope.setResponse = function (response) {
      console.info('Response available')
      $scope.response = response
    }

    $scope.model = {
      key: '6LfogRgUAAAAACNUIiCwMJPsPJ0NxiS7tafx-B55'
    }

    $scope.setWidgetId = function (widgetId) {
      console.info('Created widget ID: %s', widgetId)
      $scope.widgetId = widgetId
    }

    $scope.cbExpiration = function () {
      console.info('Captcha expired. Resetting response object')
      vcRecaptchaService.reload($scope.widgetId)
      $scope.response = null
    }

    var handleFileSelect = function (evt) {
      console.log('entrou')
      var file = evt.currentTarget.files[0]
      var reader = new FileReader()
      reader.onload = function (evt) {
        $scope.$apply(function ($scope) {
          $scope.myImage = evt.target.result
        })
      }
      reader.readAsDataURL(file)
    }
    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect)

    $scope.time_zone = new Date().getTimezoneOffset()
    $scope.search = function () {
      $http({
        method: 'GET',
        url: 'https://nyachan-server.herokuapp.com/api/threads?sortType=numberOfPosts'
      }).then(function mySucces (response) {
        $scope.threads = response.data
      }, function myError (response) {
        console.log(response || 'Request failed')
      })
    }
    $scope.threads = $scope.search()

    $scope.registerUser = function (post) {
      $http({
        url: 'https://nyachan-server.herokuapp.com/recaptcha',
        method: 'POST',
        data: {'response': $scope.response},
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(function successCallback (response) {
        validatedPost(JSON.parse(response.data.body).success)
        toastr.success('Congratulations', 'Now you are a Nyan')
      }, function errorCallback (response) {
        console.log(response)
      })
      function validatedPost (valid) {
        if (valid) {

        } else {
          vcRecaptchaService.reload($scope.widgetId)
          return
        }
        var dataUser = {
          login: post.login,
          password: post.password,
          email: post.email
        }
        var avatar = $scope.myCroppedImage

        if (avatar !== undefined) {
          var formData = new FormData()
          var base64ImageContent = avatar.replace(/^data:image\/(png|jpeg);base64,/, '')
          var blob = base64ToBlob(base64ImageContent, 'image/jpeg')

          formData.append('fileData', blob)
          var xhr = new XMLHttpRequest()
          xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              var uploadedFile = xhr.response
              dataUser.avatar = uploadedFile
              sendUser(dataUser)
            }
          }
          xhr.upload.addEventListener('progress', function (evt) {
            if (evt.lengthComputable) {
              var percentComplete = evt.loaded / evt.total
              $('#loader').width(Math.round(percentComplete * 100) + '%')
            }
          }, false)
          xhr.open('post', '/dbxAvatar/' + dataUser.login, true)
          xhr.send(formData)
        } else {
          sendUser(dataUser)
        }
        function sendUser (dataUser) {
          $http({
            method: 'POST',
            url: 'https://nyachan-server.herokuapp.com/registerUser',
            data: dataUser,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function mySucces (response) {
            console.log('Success')
            console.log(response)
            $('#signUpModal').modal('hide')
            $('#loader').width('0%')
          }, function myError (response) {
            console.log(response || 'Request failed')
          })
        }
      }
    }

    $scope.loginUser = function (post) {
      var dataUser = {
        login: post.login,
        password: post.password
      }
      $http({
        method: 'POST',
        url: 'https://nyachan-server.herokuapp.com/loginUser',
        data: dataUser,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function mySucces (response) {
        $('#loginModal').modal('hide')
        response.data.password = post.password
        $cookieStore.put('user', response.data)
        $scope.userName = response.data.login
        $scope.userImage = response.data.avatar
        $scope.isUserLogged = true
        $scope.isUserAdmin = response.data.role === "admin";
        toastr.success('Welcome back', 'We were wainting for you')
      }, function myError (response) {
        console.log(response || 'Request failed')
        toastr.error('Something went wrong', 'Is this your real name?')
      })
    }

    $scope.logoutUser = function () {
      $http({
        method: 'GET',
        url: 'https://nyachan-server.herokuapp.com/logout',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function mySucces (response) {
        $scope.isUserLogged = false
        $cookies.remove("user",{path:'/'})
        toastr.success('Goodbye', 'See you soon')
      }, function myError (response) {
        console.log(response || 'Request failed')
      })
    }
  })
})()
