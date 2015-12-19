$(document).ready(init);

function init(){
  var userPanel = $('.userPanel')
  var viewContainer = $('.viewContainer')
  $(window).resize(function(){
    console.log('hello')
    if(userPanel.outerHeight() > viewContainer.outerHeight()){
      viewContainer.css('height',userPanel.outerHeight());
    } else {
      userPanel.css('height',viewContainer.outerHeight());
      console.log('Content: '+ viewContainer.outerHeight())
      console.log('userPanel: '+ userPanel.outerHeight())
}
  })
}