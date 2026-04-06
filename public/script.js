// Add interaction script
document.addEventListener("DOMContentLoaded", () => {
    // Reveal effects on scroll
    const reveals = document.querySelectorAll('.timeline-item, .skill-tag, .about-text, .project-card');

    // Add reveal class to cards initially
    reveals.forEach(card => card.classList.add('reveal'));

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        reveals.forEach(reveal => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    // triggering scroll event on load
    revealOnScroll();

    // Button interaction
    const exploreBtn = document.getElementById('explore-btn');
    if(exploreBtn) {
        exploreBtn.addEventListener('click', (e) => {
             e.preventDefault();
             document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // --- FULL STACK LOGIC (Client-Side) ---

    // 1. Form Submission (Client -> Express)
    const contactForm = document.getElementById("contact-form");
    const formStatus = document.getElementById("form-status");
    
    if(contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = document.getElementById("submit-btn");
            btn.innerText = "Sending...";
            
            const payload = {
                name: document.getElementById("name").value,
                email: document.getElementById("email").value,
                message: document.getElementById("message").value
            };
            
            try {
                const response = await fetch("/api/contact", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                
                formStatus.innerText = data.response;
                formStatus.style.display = "block";
                contactForm.reset();
            } catch (err) {
                formStatus.innerText = "Error sending message. Is the server running?";
                formStatus.style.color = "red";
                formStatus.style.display = "block";
            }
            btn.innerText = "Send Message";
        });
    }

    // 2. Chatbot Logic (Interacting with AI Backend)
    const chatToggle = document.getElementById("chat-toggle");
    const closeChat = document.getElementById("close-chat");
    const chatWindow = document.getElementById("chat-window");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    if(chatToggle && chatWindow && chatForm) {
         chatToggle.addEventListener("click", () => chatWindow.classList.toggle("hidden"));
         closeChat.addEventListener("click", () => chatWindow.classList.add("hidden"));

         chatForm.addEventListener("submit", async (e) => {
             e.preventDefault();
             const userText = chatInput.value.trim();
             if(!userText) return;

             // Add user message to UI
             chatMessages.innerHTML += `<div class="user-msg">${userText}</div>`;
             chatInput.value = "";
             chatMessages.scrollTop = chatMessages.scrollHeight;

             // Show temporary loading indicator
             const loadingId = "loading-" + Date.now();
             chatMessages.innerHTML += `<div class="bot-msg" id="${loadingId}">...</div>`;
             chatMessages.scrollTop = chatMessages.scrollHeight;

             try {
                 // Call Express AI Route
                 const response = await fetch("/api/chat", {
                     method: "POST",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ userMessage: userText })
                 });
                 const data = await response.json();
                 
                 // Remove loading block and inject answer
                 document.getElementById(loadingId).remove();
                 chatMessages.innerHTML += `<div class="bot-msg">${data.reply}</div>`;
                 chatMessages.scrollTop = chatMessages.scrollHeight;
             } catch (err) {
                 document.getElementById(loadingId).remove();
                 chatMessages.innerHTML += `<div class="bot-msg" style="color:red">Connection lost.</div>`;
             }
         });
    }
});
