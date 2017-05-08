// $('body').on('click', '.some-image', function(){
//   if($(this).attr('data-is-full')=='0'){
//     $(this).attr('src',$(this).attr('data-full'));
//     $(this).attr('data-is-full',1);
//   }else{
//     $(this).attr('src',$(this).attr('data-thumb'));
//     $(this).attr('data-is-full',0);
//   }
//
// });

function restoreImage () {
  $(this).parent().children('.some-image').show()
  $(this).remove()
}
function toggle (obj) {
  var img = obj.data('full')
  var full = '<img src="' + img + '" class="img-responsive"/>'
  var tag = $(full)
  $(tag).on('click', restoreImage)
  var w = obj.attr('width')
  $(tag).attr('width', obj.data('width'))
  $(tag).data('width', w)
  var h = obj.attr('height')
  $(tag).attr('height', obj.data('height'))
  $(tag).data('height', h)
  obj.hide()
  obj.parent().append(tag)
  obj.parent().parent().parent().removeClass('col-md-4')
  obj.parent().parent().parent().addClass('col-md-12')
}

$(document).ready(function () {
  $('#selectTags').multiselect()
})

$(document).ready(function () {
  $('#changeTags').multiselect({
      nonSelectedText: 'Change Tags',
      onDropdownHidden: function(event) {
          var selectedOptions = $('#changeTags option:selected');
          if(selectedOptions.length != 0){
            var arrSelected = [];
            selectedOptions.each(function(){
               arrSelected.push($(this).val());
            });
            var scope = angular.element(document.getElementById("body")).scope();
            scope.$apply(function () {
              scope.changeTags(arrSelected);
            })
          }
      }
  });
})

$('#newThreadButton').click(function () {
  var actualTag = $('#tagTitle').attr('value')
  $('#selectTags').multiselect('select', [actualTag])
})
