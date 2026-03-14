// ========== SISTEM COȘ DE CUMPĂRĂTURI ==========

// Inițializare coș din localStorage
let cos = JSON.parse(localStorage.getItem('cos')) || [];

// ===== FUNCȚII PENTRU TOATE PAGINILE =====

// Actualizează badge-ul în header
function actualizeazaBadgeCos() {
    let iconCos = document.querySelector('.fa-cart-shopping');
    if (iconCos) {
        let parent = iconCos.closest('.icon-link');
        if (!parent) return;
        
        // Elimină badge-ul vechi
        let badgeVechi = document.querySelector('.cos-badge');
        if (badgeVechi) badgeVechi.remove();
        
        // Adaugă badge nou doar dacă sunt produse
        if (cos.length > 0) {
            let badge = document.createElement('span');
            badge.className = 'cos-badge';
            badge.textContent = cos.length;
            parent.style.position = 'relative';
            parent.appendChild(badge);
        }
    }
}

// Verifică dacă un produs e în coș
function esteInCos(numeProdus) {
    return cos.some(p => p.nume === numeProdus);
}

// ===== FUNCȚIA PRINCIPALĂ DE ADAUGARE ÎN COȘ =====
// AM ȘTERS VERSIUNEA CU ID ȘI AM PĂSTRAT-O PE CEA CU NUME
function adaugaInCos(buton, nume, pret, imagine, pagina) {
    // Verifică dacă produsul există deja (după nume)
    let index = cos.findIndex(p => p.nume === nume);
    
    if (index === -1) {
        // Adaugă produs nou
        cos.push({
            nume: nume,
            pret: pret,
            imagine: imagine,
            pagina: pagina,
            cantitate: 1
        });
        
        // Feedback vizual
        buton.innerHTML = '<i class="fa-solid fa-check"></i> În coș';
        buton.style.background = '#00aa00';
        setTimeout(() => {
            buton.innerHTML = '<i class="fa-solid fa-cart-plus"></i> Adaugă în coș';
            buton.style.background = '#0066cc';
        }, 2000);
        
        arataNotificare('✅ Produs adăugat în coș!');
    } else {
        arataNotificare('ℹ️ Produsul este deja în coș');
    }
    
    // Salvează în localStorage
    localStorage.setItem('cos', JSON.stringify(cos));
    
    // Actualizează badge-ul
    actualizeazaBadgeCos();
}

// Șterge din coș
function stergeDinCos(numeProdus) {
    cos = cos.filter(p => p.nume !== numeProdus);
    localStorage.setItem('cos', JSON.stringify(cos));
    actualizeazaBadgeCos();
    arataNotificare('❌ Produs șters din coș');
    
    // Dacă suntem pe pagina coșului, reîncarcă lista
   if (window.location.pathname.includes('cos')) {
    afiseazaCos();
}
}

// Actualizează cantitate
function schimbaCantitate(numeProdus, modificare) {
    let produs = cos.find(p => p.nume === numeProdus);
    if (produs) {
        let nouaCantitate = (produs.cantitate || 1) + modificare;
        if (nouaCantitate > 0) {
            produs.cantitate = nouaCantitate;
            localStorage.setItem('cos', JSON.stringify(cos));
            afiseazaCos();
        } else {
            stergeDinCos(numeProdus);
        }
    }
}

// Calculează total coș
function calculeazaTotal() {
    let total = 0;
    for (let produs of cos) {
        let pretNumar = parseFloat(produs.pret.replace(/[^0-9,]/g, '').replace(',', '.'));
        total += pretNumar * (produs.cantitate || 1);
    }
    return total.toFixed(2).replace('.', ',') + ' lei';
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

// ===== FUNCȚII PENTRU PAGINA COȘULUI =====

// Afișează conținutul coșului
function afiseazaCos() {
    let container = document.getElementById('cos-container');
    if (!container) return;
    
    if (cos.length === 0) {
        container.innerHTML = `
            <div class="cos-empty">
                <i class="fa-solid fa-cart-shopping"></i>
                <h3>Coșul tău este gol</h3>
                <p>Adaugă produse pentru a continua</p>
                <a href="index.html" class="btn-continua">Continuă cumpărăturile</a>
            </div>
        `;
        let totalContainer = document.getElementById('cos-total');
        if (totalContainer) totalContainer.innerHTML = '';
        return;
    }
    
    let html = '<div class="cos-items">';
    for (let produs of cos) {
        let pretNumar = parseFloat(produs.pret.replace(/[^0-9,]/g, '').replace(',', '.'));
        let subtotal = (pretNumar * (produs.cantitate || 1)).toFixed(2).replace('.', ',');
        
        html += `
            <div class="cos-item">
                <img src="${produs.imagine}" alt="${produs.nume}" style="width: 80px; height: 80px; object-fit: contain;">
                <div class="cos-item-info">
                    <h4>${produs.nume}</h4>
                    <div class="cos-item-pret">${produs.pret}</div>
                </div>
                <div class="cos-item-cantitate">
                    <button onclick="schimbaCantitate('${produs.nume.replace(/'/g, "\\'")}', -1)">−</button>
                    <span>${produs.cantitate || 1}</span>
                    <button onclick="schimbaCantitate('${produs.nume.replace(/'/g, "\\'")}', 1)">+</button>
                </div>
                <div class="cos-item-subtotal">${subtotal} lei</div>
                <button class="cos-item-sterge" onclick="stergeDinCos('${produs.nume.replace(/'/g, "\\'")}')">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `;
    }
    html += '</div>';
    
    container.innerHTML = html;
    
    // Afișează totalul
    let totalContainer = document.getElementById('cos-total');
    if (totalContainer) {
        totalContainer.innerHTML = `
            <div class="cos-total-box">
                <span>Total:</span>
                <span class="cos-total-valoare">${calculeazaTotal()}</span>
            </div>
            <button class="btn-finalizeaza" onclick="finalizeazaComanda()">
                Finalizează comanda
            </button>
        `;
    }
}




// Finalizează comanda
function finalizeazaComanda() {
    if (cos.length === 0) {
        arataNotificare('Coșul tău este gol!');
        return;
    }
    
    // Redirecționează către pagina de finalizare comandă
    window.location.href = 'comanda.html';
}



// Inițializare la încărcare
document.addEventListener('DOMContentLoaded', function() {
    actualizeazaBadgeCos();
    
    // Dacă suntem pe pagina coșului, afișează produsele
    if (window.location.pathname.includes('cos')) {
        afiseazaCos();
    }
});