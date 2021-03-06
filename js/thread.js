(function () {
  var app = angular.module('nya-chan', ['angular-loading-bar', 'ngCookies', 'vcRecaptcha', 'toastr','ui.bootstrap'])
    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
      cfpLoadingBarProvider.includeSpinner = false
    }])

  app.controller('threadController', function ($scope, $http, $window, $cookies, $cookieStore, vcRecaptchaService, toastr) {
    $scope.init = function () {
      $scope.isUserLogged = false
      $scope.isUserAdmin = false
      if ($cookies.get('user') !== undefined) {
        var user = JSON.parse($cookies.get('user'))
        $scope.userName = user.login
        $scope.userImage = user.avatar
        $scope.isUserLogged = true
        $scope.isUserAdmin = user.role === 'admin'
      } else {
        $scope.userName = 'Anon'
      }
    }


    $scope.reportPost = function(threadIdReport, postIdReport){
      var dataReport = {
        reason: null,
        threadId: threadIdReport,
        postId: postIdReport
      }
      $http({
        method: 'POST',
        url: 'https://nyachan-server.herokuapp.com/api/reportPost',
        // url: "http://localhost:3000/api/reportPost",
        data: dataReport,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function mySucces (response) {
        toastr.success('Report completed', 'Success')
      }, function myError (response) {
        console.log('Error ' + response.body)
      })
    }

    $scope.banIP = function(threadIdBan, postIdBan, userIPBan, userNameBan, banTime){
      var dataBan = {
        threadId: threadIdBan,
        postId: postIdBan,
        userIP: userIPBan,
        user: userNameBan,
        banTime: banTime
      }
      $http({
        method: 'POST',
        url: 'https://nyachan-server.herokuapp.com/api/banIP',
        // url: "http://localhost:3000/api/banIP",
        data: dataBan,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function mySucces (response) {
        toastr.success('Ban completed', 'Success')
        $scope.thread = $scope.searchThread(searchId)
      }, function myError (response) {
        console.log('Error ' + response.data)
        if(response.data === "User is banned"){
          toastr.error('User is already banned!', 'Error')
        }
      })
    }

    $scope.changeTags = function (selectedTags) {
      var dataTags = {
        user: JSON.parse($cookies.get('user')),
        thread: $scope.thread._id,
        tags: selectedTags
      }
      $http({
        method: 'POST',
        url: 'https://nyachan-server.herokuapp.com/api/changeTags',
        // url: "http://localhost:3000/changeTags",
        data: dataTags,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function mySucces (response) {
        $scope.thread = $scope.searchThread(searchId)
        toastr.success('Tags changed', 'Success')
      }, function myError (response) {
        console.log('Error ' + response.body)
      })
    }

    $scope.deleteThread = function (threadId) {
      var dataDelete = {
        user: JSON.parse($cookies.get('user')),
        thread: threadId
      }
      $http({
        method: 'DELETE',
        url: 'https://nyachan-server.herokuapp.com/api/delete/thread',
        // url: "http://localhost:3000/api/delete/thread",
        data: dataDelete,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function mySucces (response) {
        toastr.success('Thread deleted', 'Success')
        $window.location.href = 'https://nyachan-server.herokuapp.com/'
      }, function myError (response) {
        console.log('Error ' + response.body)
      })
    }
    $scope.downloadFiles = function(imgFiles)
    {
      var getSingleBinCont = function (zip, value) {
          var deferred = $.Deferred()
          var trueLink = value.source.replace("www.dropbox.com", "dl.dropboxusercontent.com")
          JSZipUtils.getBinaryContent(trueLink, function (err, data){
              if(err){
                  deferred.reject(err)
              }
              else{
                  zip.file(value.name, data, {binary:true})
                  deferred.resolve(data)
              }
          });
          return deferred
      }
      var downloadZip = function (){
        var zip = new JSZip()
        var deferreds = []

        angular.forEach(imgFiles, function (value, key){
            deferreds.push(getSingleBinCont(zip, value))
        });
        $.when.apply($, deferreds).done(function () {
            var blob = zip.generateAsync({type:"blob"}).then(function(content) {
                saveAs(content, "images.zip");
            });
        });
      }
      downloadZip()
    }
    $scope.deletePost = function (threadId, postId) {
      var dataDelete = {
        user: JSON.parse($cookies.get('user')),
        post: postId,
        thread: threadId
      }
      $http({
        method: 'DELETE',
        url: 'https://nyachan-server.herokuapp.com/api/delete/post',
        // url: "http://localhost:3000/api/delete/post",
        data: dataDelete,
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(function mySucces (response) {
        $scope.thread = $scope.searchThread(searchId)
        toastr.success('Post deleted', 'Success')
      }, function myError (response) {
        console.log('Error ' + response.body)
      })
    }

    $scope.time_zone = new Date().getTimezoneOffset()
    var url = $(location).attr('href')
    var searchId = url.substring(url.lastIndexOf('/') + 1)
    $scope.response = null
    $scope.widgetId = null

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

    $scope.setResponse = function (response) {
      console.info('Response available')

      $scope.response = response
    }

    $scope.searchThread = function (threadID) {
      $http({
        method: 'GET',
        url: 'https://nyachan-server.herokuapp.com/api/thread/' + threadID
              // url: "http://localhost:3000/api/thread/" + threadID
      }).then(function mySucces (response) {
        $scope.thread = response.data[0]
      }, function myError (response) {
        $window.location.href = 'https://nyachan-server.herokuapp.com/404'
      })
    }

    $scope.thread = $scope.searchThread(searchId)

    $scope.addPost = function (post) {
      $http({
        url: 'https://nyachan-server.herokuapp.com/recaptcha',
        method: 'POST',
        data: {'response': $scope.response},
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      }).then(function successCallback (response) {
        validatedPost(JSON.parse(response.data.body).success)

      }, function errorCallback (response) {
        console.log(response)
      })

      function validatedPost (valid) {
        if (valid) {

        } else {
          vcRecaptchaService.reload($scope.widgetId)
          return
        }
        var files = $('#file')[0].files

        if (post === undefined) {
          post = {}
          post.body = ' '
        }

        if (!validarPost(post, files)) {
          return
        }
        console.log(files)
        if (files !== undefined && files.length > 0) {
          if (!validFile(files[0].name)) {
            alert('Arquivo Invalido')
            return
          }
        }
        var uploadedFiles = [];
        if (files !== undefined && files.length > 0) {
          var sendFilesToDropbox = function (i, files, uploadedFiles) {
            var formData = new FormData()
            formData.append('fileData', files[i])
            var xhr = new XMLHttpRequest()
            xhr.onreadystatechange = function () {
              if (xhr.readyState === XMLHttpRequest.DONE) {
                var uploadedFile = JSON.parse(xhr.response)
                uploadedFiles[i] = uploadedFile
                if (i >= files.length - 1) {
                  $('#loader').width('90%')
                  sendPost(files, uploadedFiles)
                } else {
                  sendFilesToDropbox(i + 1, files, uploadedFiles)
                }
              }
            }
            xhr.upload.addEventListener('progress', function (evt) {
              if (evt.lengthComputable) {
                var percentComplete = evt.loaded / evt.total
                percentComplete = (percentComplete / files.length) * (i + 1)
                $('#loader').width(Math.round(percentComplete * 75) + '%')
              }
            }, false)
            xhr.open('post', '/dbxPost/0/' + $scope.thread._id, true)
            xhr.send(formData)
            console.log('UPLOAD ' + i)
          }
          sendFilesToDropbox(0, files, uploadedFiles)
        } else {
          sendPost(undefined, undefined)
        }

        function sendPost (files, uploadedFiles) {
          if (files !== undefined && files.length > 0) {
            var dataPost = {
              threadid: $scope.thread._id,
              body: post.body,
              date: '2016-01-02 19:33:00',
              title: post.title,
              userName: $scope.userName,
              file: filesToJSON(files, uploadedFiles)
            }
          } else {
            var dataPost = {
              threadid: $scope.thread._id,
              body: post.body,
              date: '2016-01-02 19:33:00',
              title: post.title,
              userName: $scope.userName
            }
          }

          $http({
            method: 'POST',
            url: 'https://nyachan-server.herokuapp.com/api/thread/newPost',
            // url: 'http://localhost:3000/api/thread/newPost',
            data: dataPost,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(function mySucces (response) {
            $('#loader').width('100%')
            setTimeout(function(){
              $scope.thread = $scope.searchThread(searchId)
              vcRecaptchaService.reload($scope.widgetId)
              $('#newThreadModal').modal('hide')
              $('#loader').width('0%')
            }, 1500)
            toastr.success('Right in the Post', 'You\'ve just answered it')
          }, function myError (response) {
            if(response.data === "User is banned"){
              toastr.error('You were banned!', 'Error')
            }else{
              toastr.error('OMG, its dead!', 'Error')
            }
            console.log(response || 'Request failed')
          })
        }
      }
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
        $cookies.remove('user', { path:'/' })
        toastr.success('Goodbye', 'See you soon')
      }, function myError (response) {
        console.log(response || 'Request failed')
      })
    }
  })
})()
