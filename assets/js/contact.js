(function () {
    'use strict';

    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('input[type="submit"]');
    if (!status || !submitBtn) return;

    const originalBtnValue = submitBtn.value;
    const isFR = document.documentElement.lang === 'fr';

    const strings = isFR ? {
        sending: 'Envoi en cours...',
        sendingMessage: '<i class="fa-solid fa-spinner fa-spin"></i> Envoi de votre message...',
        success: '<i class="fa-solid fa-check"></i> Message envoyé.',
        errorGeneric: "Erreur lors de l'envoi.",
        errorNetwork: 'Erreur réseau.'
    } : {
        sending: 'Sending...',
        sendingMessage: '<i class="fa-solid fa-spinner fa-spin"></i> Sending your message...',
        success: '<i class="fa-solid fa-check"></i> Message sent successfully.',
        errorGeneric: 'Error sending message.',
        errorNetwork: 'Network error.'
    };

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (submitBtn.disabled) return;

        submitBtn.disabled = true;
        submitBtn.value = strings.sending;
        status.innerHTML = strings.sendingMessage;

        fetch('https://formspree.io/f/xdkrglon', {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
            .then(response => {
                if (response.ok) {
                    status.innerHTML = strings.success;
                    form.reset();
                } else {
                    return response.json().then(data => {
                        if (data.errors) {
                            status.innerText = data.errors.map(e => e.message).join(', ');
                        } else {
                            status.innerText = strings.errorGeneric;
                        }
                    });
                }
            })
            .catch(() => {
                status.innerText = strings.errorNetwork;
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.value = originalBtnValue;
            });
    });
})();
