(function () {
    'use strict';

    const form = document.getElementById('contact-form');
    if (!form) return;

    const status = document.getElementById('form-status');
    const submitBtn = form.querySelector('input[type="submit"]');
    if (!status || !submitBtn) return;

    const originalBtnValue = submitBtn.value;
    const isFR = document.documentElement.lang === 'fr';

    const spinnerSvg = '<svg class="icon-spin" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v4a8 8 0 1 1-7.39 4.91l-3.69-1.55A12 12 0 1 0 12 2z" fill="currentColor"/></svg>';
    const checkSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/></svg>';

    const strings = isFR ? {
        sending: 'Envoi en cours...',
        sendingMessage: spinnerSvg + ' Envoi de votre message...',
        success: checkSvg + ' Message envoyé.',
        errorGeneric: "Erreur lors de l'envoi.",
        errorNetwork: 'Erreur réseau.'
    } : {
        sending: 'Sending...',
        sendingMessage: spinnerSvg + ' Sending your message...',
        success: checkSvg + ' Message sent successfully.',
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
