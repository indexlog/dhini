// file: app.js
document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 0. SETUP MODAL GENERIK & LIGHTBOX
    // ==========================================
    const modalEl = document.getElementById('detailModal');
    const bsModal = new bootstrap.Modal(modalEl);
    const mDialog = document.getElementById('modalDialog');
    const mHeader = document.getElementById('modalHeader');
    const mTitle = document.getElementById('modalTitle');
    const mBody = document.getElementById('modalBody');

    // Fungsi: Modal untuk Teks Deskripsi
    const showTextDetail = (title, html) => {
        mDialog.classList.remove('modal-xl');
        mHeader.style.display = 'flex';
        mTitle.innerText = title;
        mBody.innerHTML = `<div class="p-4 p-md-5 text-muted">${html}</div>`;
        bsModal.show();
    };

    // Fungsi: Modal untuk Gambar Fullscreen (Bisa Slide/Geser)
    const showImageFull = (imgData) => {
        mDialog.classList.add('modal-xl'); 
        mHeader.style.display = 'none'; 
        
        let contentHTML = '';

        // Jika gambarnya lebih dari 1 (Array/Slider)
        if (Array.isArray(imgData) && imgData.length > 1) {
            let slidesHTML = '';
            imgData.forEach((src, idx) => {
                let activeClass = idx === 0 ? 'active' : '';
                slidesHTML += `
                    <div class="carousel-item ${activeClass} h-100 text-center" style="background: black;">
                        <img src="${src}" class="lightbox-img w-100" style="height: 90vh; object-fit: contain;" alt="Detail Karya">
                    </div>`;
            });

            contentHTML = `
                <button type="button" class="btn-close btn-close-lightbox" data-bs-dismiss="modal" aria-label="Close"></button>
                <div id="modal-carousel" class="carousel slide w-100 h-100" data-bs-ride="carousel">
                    <div class="carousel-inner h-100">${slidesHTML}</div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#modal-carousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true" style="width:3rem; height:3rem;"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#modal-carousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true" style="width:3rem; height:3rem;"></span>
                    </button>
                </div>
            `;
        } 
        // Jika gambarnya cuma 1
        else {
            let src = Array.isArray(imgData) ? imgData[0] : imgData;
            contentHTML = `
                <button type="button" class="btn-close btn-close-lightbox" data-bs-dismiss="modal" aria-label="Close"></button>
                <div class="text-center w-100" style="background: black;">
                    <img src="${src}" class="lightbox-img w-100" style="height: 90vh; object-fit: contain;" alt="Detail">
                </div>
            `;
        }

        mBody.innerHTML = contentHTML;
        bsModal.show();
    };

    // ==========================================
    // 1. INTRO SCREEN & RENDER TEXT
    // ==========================================
    setTimeout(() => {
        gsap.to("#intro-screen", { opacity: 0, duration: 1, onComplete: () => document.getElementById("intro-screen").style.display = "none" });
    }, 2500);

    const p = portfolioData.profile;
    document.getElementById("render-name").innerText = p.name;
    document.getElementById("render-role").innerText = p.role;
    document.getElementById("render-about").innerText = p.about;
    document.getElementById("render-cv").href = p.cv_link;
    
    // Foto Profil
    const pImg = document.getElementById("render-photo");
    pImg.src = p.photo;
    pImg.onclick = () => showImageFull(p.photo);

    // ==========================================
    // 2. RENDER PENGALAMAN & PENDIDIKAN
    // ==========================================
    const expRow = document.getElementById("render-experience");
    portfolioData.experience.forEach((exp, i) => {
        const id = `exp-${i}`;
        expRow.innerHTML += `<div class="col-md-6"><div class="glass-card h-100 p-4" id="${id}"><h5 class="fw-bold text-dark">${exp.title}</h5><span class="badge bg-dark mb-3">${exp.year}</span><p class="text-primary fw-bold mb-2">${exp.company}</p><p class="text-muted small text-truncate">Klik untuk membaca detail tugas...</p></div></div>`;
        setTimeout(() => {
            document.getElementById(id).onclick = () => showTextDetail(exp.title, `<b>${exp.company}</b><br><span class="badge bg-dark my-2">${exp.year}</span><br><br>${exp.desc}`);
        }, 100);
    });

    const eduRow = document.getElementById("render-education");
    portfolioData.education.forEach((edu, i) => {
        const id = `edu-${i}`;
        eduRow.innerHTML += `<div class="col-md-12"><div class="glass-card border-start border-4 border-dark p-4" id="${id}"><h4 class="fw-bold text-dark">${edu.degree}</h4><p class="text-primary fw-bold mb-0">${edu.school}</p></div></div>`;
        setTimeout(() => {
            document.getElementById(id).onclick = () => showTextDetail(edu.degree, `<b>${edu.school}</b><br><br>${edu.desc}`);
        }, 100);
    });

    // ==========================================
    // 3. RENDER KARYA, PRESTASI, SERTIFIKAT (WITH SLIDER)
    // ==========================================
    const renderImgCards = (containerId, dataArray) => {
        const row = document.getElementById(containerId);
        if (!row) return;
        row.innerHTML = ''; 

        dataArray.forEach((item, i) => {
            const id = `${containerId}-${i}`;
            let imgHTML = '';

            // Cek jika gambar adalah Array (Slide)
            if (Array.isArray(item.img)) {
                let slidesHTML = '';
                item.img.forEach((src, idx) => {
                    let activeClass = idx === 0 ? 'active' : '';
                    slidesHTML += `
                        <div class="carousel-item ${activeClass} h-100">
                            <img src="${src}" class="d-block w-100 h-100" style="object-fit:cover" alt="Gambar">
                        </div>`;
                });

                imgHTML = `
                <div id="slide-${id}" class="carousel slide" data-bs-ride="carousel" style="height:250px; overflow:hidden;">
                    <div class="carousel-inner h-100">${slidesHTML}</div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#slide-${id}" data-bs-slide="prev" onclick="event.stopPropagation()">
                        <span class="carousel-control-prev-icon bg-dark rounded-circle" style="width:2rem; height:2rem; background-size:60%;" aria-hidden="true"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#slide-${id}" data-bs-slide="next" onclick="event.stopPropagation()">
                        <span class="carousel-control-next-icon bg-dark rounded-circle" style="width:2rem; height:2rem; background-size:60%;" aria-hidden="true"></span>
                    </button>
                </div>`;
            } else {
                imgHTML = `<img src="${item.img}" class="img-fluid w-100 border-bottom" style="height:250px; object-fit:cover" alt="Gambar">`;
            }

            row.innerHTML += `
            <div class="col-md-6 mb-4 reveal">
                <div class="glass-card h-100 overflow-hidden p-0" id="${id}">
                    ${imgHTML}
                    <div class="p-4">
                        ${item.category ? `<span class="badge bg-secondary mb-2">${item.category}</span>` : ''}
                        <h5 class="fw-bold text-dark mb-1">${item.title}</h5>
                        ${item.desc ? `<p class="text-muted small mb-0">${item.desc}</p>` : ''}
                    </div>
                </div>
            </div>`;

            setTimeout(() => { 
                const cardEl = document.getElementById(id);
                if(cardEl) cardEl.onclick = () => showImageFull(item.img); 
            }, 100);
        });
    };

    renderImgCards("render-works", portfolioData.works);
    renderImgCards("render-achievements", portfolioData.achievements);
    if(portfolioData.certificates) renderImgCards("render-certificates", portfolioData.certificates);

    // ==========================================
    // 4. SOCIAL CONTACTS
    // ==========================================
    const s = portfolioData.contacts;
    document.getElementById("render-socials").innerHTML = `
        <a href="https://wa.me/${s.whatsapp}" target="_blank" class="social-item"><i class="fab fa-whatsapp"></i></a>
        <a href="https://instagram.com/${s.instagram.replace('@','')}" target="_blank" class="social-item"><i class="fab fa-instagram"></i></a>
        <a href="https://tiktok.com/@${s.tiktok.replace('@','')}" target="_blank" class="social-item"><i class="fab fa-tiktok"></i></a>
        <a href="${s.linkedin}" target="_blank" class="social-item"><i class="fab fa-linkedin"></i></a>
        <a href="mailto:${s.email}" class="social-item"><i class="fas fa-envelope"></i></a>`;

    // ==========================================
    // 5. ANIMASI GSAP & LOGIKA ACCORDION
    // ==========================================
    VanillaTilt.init(document.querySelector(".tilt-container"), { max: 8, speed: 400, glare: true, "max-glare": 0.1 });
    
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.collapse').forEach(c => {
        c.addEventListener('shown.bs.collapse', () => ScrollTrigger.refresh());
        c.addEventListener('hidden.bs.collapse', () => ScrollTrigger.refresh());
    });

    // Auto close navbar & open accordion
    document.querySelectorAll('.nav-link').forEach(link => {
        link.onclick = function() {
            const nav = document.getElementById('navbarNav');
            if (nav.classList.contains('show')) bootstrap.Collapse.getInstance(nav).hide();
            const targetId = this.getAttribute('href');
            if(targetId !== '#hero' && targetId !== '#contact') {
                const collapse = document.querySelector(targetId)?.querySelector('.collapse');
                if (collapse && !collapse.classList.contains('show')) {
                    new bootstrap.Collapse(collapse).show();
                    setTimeout(() => ScrollTrigger.refresh(), 500);
                }
            }
        };
    });

    // ==========================================
    // 6. FORM AJAX WEB3FORMS
    // ==========================================
    const form = document.getElementById('contact-form');
    if(form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            const res = document.getElementById('form-result');
            res.style.display = "block"; res.className = "mt-3 text-center fw-bold text-secondary"; res.innerText = "Mengirim pesan...";
            fetch('https://api.web3forms.com/submit', {
                method: 'POST', headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(Object.fromEntries(new FormData(this)))
            }).then(r => {
                if(r.status === 200) { res.className = "mt-3 text-center fw-bold text-success"; res.innerText = "Terkirim!"; this.reset(); }
                else { res.className = "mt-3 text-center fw-bold text-danger"; res.innerText = "Gagal mengirim."; }
            }).catch(() => { res.className = "mt-3 text-center fw-bold text-danger"; res.innerText = "Error jaringan."; });
        };
    }
});
// ==========================================
    // 7. SISTEM DARK/LIGHT MODE (Menyimpan Pilihan)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    const htmlElement = document.documentElement;

    // A. Cek apakah sebelumnya pengunjung sudah pernah memilih Dark Mode
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun'); // Ganti ikon jadi Matahari
    }

    // B. Reaksi saat tombol ditekan
    themeToggleBtn.addEventListener('click', () => {
        
        // --- TAMBAHAN BARU: Tutup Navbar otomatis di HP saat ganti mode ---
        const nav = document.getElementById('navbarNav');
        if (nav && nav.classList.contains('show')) {
            bootstrap.Collapse.getInstance(nav).hide();
        }
        // ------------------------------------------------------------------

        // Jika sedang Light Mode, ubah ke Dark Mode
        if (htmlElement.getAttribute('data-theme') !== 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('portfolio-theme', 'dark'); 
            
            gsap.to(themeIcon, { rotation: 360, duration: 0.5 });
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } 
        // Jika sedang Dark Mode, kembalikan ke Light Mode
        else {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('portfolio-theme', 'light');
            
            gsap.to(themeIcon, { rotation: -360, duration: 0.5 });
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    });