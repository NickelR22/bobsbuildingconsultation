document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".footer").innerHTML = `&copy; ${new Date().getFullYear()} Your Company. All rights reserved.`;
    
    let lastScrollY = window.scrollY;
    let rotation = 0;
    const tree = document.getElementById("tree");
    
    window.addEventListener("scroll", function() {
        let currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY) {
            rotation += 5; // Rotate forward
        } else if (currentScrollY < lastScrollY) {
            rotation -= 5; // Rotate backward
        }
        
        tree.style.transform = `rotateY(${rotation}deg)`;
        lastScrollY = currentScrollY;
    });
});

