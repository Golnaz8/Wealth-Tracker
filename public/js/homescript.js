// JavaScript for smooth scrolling nav bar

  
//When scrolling turn green 
  $(function () {
    $(document).scroll(function () {
        var $nav = $("#mainNavbar");
        $nav.toggleClass("scrolled", $(this).scrollTop() > $nav.height());
    });
}); 