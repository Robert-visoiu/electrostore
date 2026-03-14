// ========== SISTEM FAVORITE GLOBAL ==========

// Inițializare listă favorite din localStorage
let favorite = JSON.parse(localStorage.getItem('favorite')) || [];

// ===== FUNCȚII PENTRU TOATE PAGINILE =====

// Actualizează badge-ul în header
function actualizeazaBadgeFavorite() {
    // Caută iconița de inimă din header
    let iconInima = document.querySelector('.fa-heart');
    if (iconInima) {
        let parent = iconInima.closest('.icon-link');
        if (!parent) return;
        
        // Elimină badge-ul vechi dacă există
        let badgeVechi = document.querySelector('.favorite-badge');
        if (badgeVechi) badgeVechi.remove();
        
        // Adaugă badge nou doar dacă sunt produse în favorite
        if (favorite.length > 0) {
            let badge = document.createElement('span');
            badge.className = 'favorite-badge';
            badge.textContent = favorite.length;
            parent.style.position = 'relative';
            parent.appendChild(badge);
        }
    }
}

// Verifică dacă un produs e în favorite
function esteInFavorite(numeProdus) {
    return favorite.some(p => p.nume === numeProdus);
}

// Adaugă sau șterge din favorite
function toggleFavorite(buton, numeProdus, pret, imagine, pagina) {
    let index = favorite.findIndex(p => p.nume === numeProdus);
    
    if (index === -1) {
        // Adaugă la favorite
        favorite.push({
            nume: numeProdus,
            pret: pret,
            imagine: imagine,
            pagina: pagina,
            data: new Date().toISOString()
        });
        
        // Schimbă aspectul butonului
        if (buton) {
            buton.classList.add('activ');
            let icon = buton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            }
        }
        
        arataNotificare('✅ Produs adăugat la favorite!');
    } else {
        // Șterge din favorite
        favorite.splice(index, 1);
        
        // Schimbă aspectul butonului
        if (buton) {
            buton.classList.remove('activ');
            let icon = buton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');
            }
        }
        
        arataNotificare('❌ Produs șters din favorite');
    }
    
    // Salvează în localStorage
    localStorage.setItem('favorite', JSON.stringify(favorite));
    
    // Actualizează badge-ul
    actualizeazaBadgeFavorite();
}

// Notificare
function arataNotificare(mesaj) {
    let notificare = document.createElement('div');
    notificare.textContent = mesaj;
    notificare.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 5px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notificare);
    
    setTimeout(() => {
        notificare.remove();
    }, 2000);
}

// Inițializare la încărcarea paginii
document.addEventListener('DOMContentLoaded', function() {
    actualizeazaBadgeFavorite();
    
    // Verifică dacă suntem pe o pagină de produs și actualizează butonul
    let numeProdus = document.querySelector('.produs-titlu')?.textContent;
    if (numeProdus && esteInFavorite(numeProdus)) {
        let buton = document.getElementById('btnFavorite');
        if (buton) {
            buton.classList.add('activ');
            let icon = buton.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');
            }
        }
    }
});

// ===== FUNCȚIE PENTRU PAGINA DE FAVORITE =====

// Afișează lista de favorite (pentru pagina specială)
function afiseazaFavorite() {
    let container = document.getElementById('lista-favorite');
    if (!container) return;
    
    if (favorite.length === 0) {
        container.innerHTML = '<p class="no-favorites">Nu ai niciun produs salvat la favorite.</p>';
        return;
    }
    
    let html = '<div class="favorite-grid">';
    for (let produs of favorite) {
        html += `
            <div class="favorite-card">
                <img src="${produs.imagine}" alt="${produs.nume}">
                <h3>${produs.nume}</h3>
                <div class="pret">${produs.pret}</div>
                <a href="${produs.pagina}" class="vezi-produs">Vezi produsul</a>
                <button class="sterge-favorite" onclick="stergeDinFavorite('${produs.nume}')">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
    }
    html += '</div>';
    container.innerHTML = html;
}

// Șterge un produs din favorite (de pe pagina de favorite)
function stergeDinFavorite(numeProdus) {
    favorite = favorite.filter(p => p.nume !== numeProdus);
    localStorage.setItem('favorite', JSON.stringify(favorite));
    actualizeazaBadgeFavorite();
    afiseazaFavorite();
    arataNotificare('❌ Produs șters din favorite');
}