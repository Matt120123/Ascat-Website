function toggleCustomMenu() {
    var menu = document.getElementById('customMenu');
    var menuIcon = document.getElementById('customMenuIcon');
    
    if (menu.style.display === 'block') {
        menu.style.display = 'none';
        menuIcon.src = '/AsiaSourceiCollege/src/imagesSource/toggle.png'; // Change to original icon
    } else {
        menu.style.display = 'block';
        menuIcon.src = '/AsiaSourceiCollege/src/imagesSource/Toggle-x.png'; // Change to close icon
    }
}

document.addEventListener('click', function(event) {
    var menu = document.getElementById('customMenu');
    var menuIcon = document.getElementById('customMenuIcon');
    var isClickInside = menu.contains(event.target) || menuIcon.contains(event.target);

    if (!isClickInside && menu.style.display === 'block') {
        menu.style.display = 'none';
        menuIcon.style.transform = 'rotate(0deg)';
        menuIcon.src = '/AsiaSourceiCollege/src/imagesSource/toggle.png'; // Change to original icon
    }
});
