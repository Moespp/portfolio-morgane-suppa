/* ========= Ecriture ============*/

var typed = new Typed(".dynamic-text", {
    strings: ["Level Designer","Game Designer", "Artiste", "Auteur"],
    typeSpeed: 80,
    backDelay: 1000,
    backSpeed: 60,
    loop: true
});

// document.addEventListener("DOMContentLoaded", () => {
//             const slides = document.querySelectorAll(".slide");
//             const slidesContainer = document.querySelector(".slides");
//             const totalSlides = slides.length;
//             let index = 0;
        
//             function moveToNextSlide() {
//                 index++;
//                 slidesContainer.style.transition = "transform 1s ease-in-out";
//                 slidesContainer.style.transform = `translateX(${-index * 100}%)`;
        
//                 if (index === totalSlides - 1) {
//                     setTimeout(() => {
//                         slidesContainer.style.transition = "none";
//                         slidesContainer.style.transform = `translateX(0)`;
//                         index = 0;
//                     }, 1000); // Duration of the transition
//                 }
//             }
        
//             setInterval(moveToNextSlide, 7500);
//         });
        
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
        
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
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

document.addEventListener('DOMContentLoaded', function() {
    var dropbtn = document.querySelector('.dropbtn');
    var dropdownContent = dropbtn.nextElementSibling;
    var dropdownBg = dropdownContent.nextElementSibling;
    var isDropdownOpen = false;

    // Fonction pour afficher le dropdown content
    function showDropdown() {
        dropdownContent.style.display = 'block';
        dropdownBg.style.display = 'block';
        isDropdownOpen = true;
    }

    // Fonction pour masquer le dropdown content
    function hideDropdown() {
        dropdownContent.style.display = 'none';
        dropdownBg.style.display = 'none';
        isDropdownOpen = false;
    }

    // Événement de clic sur le bouton
    dropbtn.addEventListener('click', function() {
        if (!isDropdownOpen) {
            showDropdown();
        } else {
            hideDropdown();
        }
    });

    // Événement de clic en dehors du dropdown
    document.addEventListener('click', function(event) {
        if (!dropbtn.contains(event.target) && !dropdownContent.contains(event.target)) {
            hideDropdown();
        }
    });

    // Événement de survol du dropdown content
    dropdownContent.addEventListener('mouseleave', function() {
        hideDropdown();
    });

    // Événement de survol du dropbtn
    dropbtn.addEventListener('mouseenter', function() {
        if (!isDropdownOpen) {
            showDropdown();
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.bouton');
    const cases = document.querySelectorAll('.cases');

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            filterCases(filter);
        });
    });

    function filterCases(filter) {
        cases.forEach(caseItem => {
            caseItem.classList.remove('show');
            if (filter === 'all' || caseItem.classList.contains(filter)) {
                caseItem.classList.add('show');
            }
        });
    }

    // Optionally, you can uncomment the next line to show all cases by default on page load
    // filterCases('all');
});

document.addEventListener('scroll', function() {
    const slider = document.getElementById('slider');
    const startFade = 500; // Position de défilement où l'opacité commence à diminuer
    const endFade = 800; // Position de défilement où l'opacité atteint 0
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

