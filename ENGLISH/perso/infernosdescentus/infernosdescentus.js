document.addEventListener('scroll', function() {
    const slider = document.getElementById('slider');
    const startFade = 800; // Position de défilement où l'opacité commence à diminuer
    const endFade = 1100; // Position de défilement où l'opacité atteint 0
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition = window.scrollY;

    let opacity;

    if (scrollPosition < startFade) {
        opacity = 1;
    } else if (scrollPosition >= startFade && scrollPosition <= endFade) {
        opacity = 1 - ((scrollPosition - startFade) / (endFade - startFade));
    } else {
        opacity = 0;
    }

    slider.style.opacity = opacity;
});

document.addEventListener('scroll', function() {
    const slider2 = document.getElementById('slider2');
    const startFade2 = 1500; // Position de défilement où l'opacité commence à diminuer
    const endFade2 = 1100; // Position de défilement où l'opacité atteint 0
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPosition2 = window.scrollY;

    let opacity;

    if (scrollPosition2 < startFade2) {
        opacity = 0;
    } else if (scrollPosition2 >= startFade2 && scrollPosition2 <= endFade2) {
        opacity = 1 - ((scrollPosition2 - startFade2) / (endFade2 - startFade2));
    } else {
        opacity = 1;
    }

    slider2.style.opacity = opacity;
});

document.addEventListener('DOMContentLoaded', function() {
    var photoCells = document.querySelectorAll('.photo-cell img');

    function openGallery(event) {
        var img = event.currentTarget;
        var gallery = document.createElement('div');
        gallery.classList.add('gallery');

        var imgClone = img.cloneNode();
        imgClone.classList.add('active');
        gallery.appendChild(imgClone);

        // Ajouter l'événement pour fermer la galerie en cliquant sur le fond transparent
        gallery.addEventListener('click', function(event) {
            if (event.target === gallery) {
                closeGallery(gallery);
            }
        });

        // Ajouter la classe pour désactiver le défilement
        document.body.classList.add('no-scroll');

        document.body.appendChild(gallery);
    }

    function closeGallery(gallery) {
        gallery.remove();

        // Supprimer la classe pour activer le défilement
        document.body.classList.remove('no-scroll');
    }

    photoCells.forEach(function(img) {
        img.addEventListener('click', openGallery);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    var backToTopButton = document.getElementById("backToTop");

    window.addEventListener("scroll", function() {
        if (window.scrollY > 200) {
            backToTopButton.classList.add("show");
        } else {
            backToTopButton.classList.remove("show");
        }
    });

    backToTopButton.addEventListener("click", function() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
});

document.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Empêche le comportement par défaut du clic droit
});

function toggleMoreText() {
    var moreText = document.getElementById("moreText");
    var presentationText = document.getElementById("presentationText");
    var btn = document.querySelector(".read-more-btn");

    if (moreText.style.display === "none") {
        moreText.style.display = "inline"; // Affiche le texte supplémentaire
        presentationText.classList.add("expanded"); // Ajoute la classe pour étendre la hauteur
        btn.textContent = "[Réduire]"; // Change le texte du bouton
    } else {
        moreText.style.display = "none"; // Masque le texte supplémentaire
        presentationText.classList.remove("expanded"); // Retire la classe pour réduire la hauteur
        btn.textContent = "[En savoir plus]"; // Change le texte du bouton
    }
}

