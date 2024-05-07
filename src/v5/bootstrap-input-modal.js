class inputModal {

    static #buildDom(configuration) {
        configuration = inputModal.#setDefaultConfiguration(configuration);

        const modal = inputModal.#buildModalDom(configuration);
        return modal;
    }

    static #setDefaultConfiguration(configuration) {
        configuration = configuration || {};
        configuration.title = configuration.title || '';
        configuration.closeIcon = configuration.closeIcon || false;
        configuration.message = configuration.message || '';
        configuration.type = configuration.type || 'text';

        if (configuration.no !== false) {
            configuration.no = configuration.no || {};
            configuration.no.class = (configuration.no.class || 'btn btn-secondary').trim() + ' confirmation-no';
            configuration.no.text = configuration.no.text || 'Cancel';
        }

        configuration.yes = configuration.yes || {};
        configuration.yes.class = (configuration.yes.class || 'btn btn-primary').trim() + ' confirmation-yes';
        configuration.yes.text = configuration.yes.text || 'Ok';

        return configuration;
    }

    static #buildModalDom(configuration) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.setAttribute('tabindex', '-1');

        const modalDialog = inputModal.#buildModalDialogDom(configuration);
        modal.appendChild(modalDialog);

        return modal;
    }

    static #buildModalDialogDom(configuration) {
        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog');

        const modalContent = inputModal.#buildModalContentDom(configuration);
        modalDialog.appendChild(modalContent);

        return modalDialog;
    }

    static #buildModalContentDom(configuration) {
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        if (configuration.title || configuration.closeIcon) {
            const modalHeader = inputModal.#buildModalHeaderDom(configuration);
            modalContent.appendChild(modalHeader);
        }

        const modalBody = inputModal.#buildModalBodyDom(configuration);
        modalContent.appendChild(modalBody);

        const formId = modalBody.getAttribute('id');
        const modalFooter = inputModal.#buildModalFooterDom(configuration, formId);
        modalContent.appendChild(modalFooter);

        return modalContent;
    }

    static #buildModalBodyDom(configuration) {
        const id = `form-${crypto.randomUUID()}`;
        const modalBody = document.createElement('form');
        modalBody.classList.add('modal-body');
        modalBody.setAttribute('id', id);

        const modalBodyText = inputModal.#buildModalBodyTextDom(configuration);
        modalBody.appendChild(modalBodyText);

        const modalBodyInput = inputModal.#buildModalInputTextDom(configuration);
        modalBody.appendChild(modalBodyInput);

        return modalBody;
    }

    static #buildModalBodyTextDom(configuration) {
        const modalBodyText = document.createElement('p');
        modalBodyText.textContent = configuration.message;

        return modalBodyText;
    }

    static #buildModalInputTextDom(configuration) {
        let type = configuration.type;
        if (!inputModal.#validateModalType(type)) {
            type = 'text';
            console.warn(`${type} is an invaild configuration type, using text`);
        }

        const modalInput = document.createElement('input');
        modalInput.classList.add('form-control')
        modalInput.setAttribute('required', 'required');
        modalInput.setAttribute('name', 'input');
        modalInput.setAttribute('type', type);

        return modalInput;
    }

    static #buildModalFooterDom(configuration, formId) {
        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');

        if (configuration.no !== false) {
            const modalFooterNoButton = inputModal.#buildModalFooterNoButtonDom(configuration);
            modalFooter.appendChild(modalFooterNoButton);
        }

        const modalFooterYesButton = inputModal.#buildModalFooterYesButtonDom(configuration, formId);
        modalFooter.appendChild(modalFooterYesButton);

        return modalFooter;
    }

    static #buildModalFooterNoButtonDom(configuration) {
        const modalFooterNoButton = document.createElement('button');
        modalFooterNoButton.setAttribute('class', configuration.no.class);
        modalFooterNoButton.textContent = configuration.no.text;
        modalFooterNoButton.setAttribute('data-bs-dismiss', 'modal');

        return modalFooterNoButton;
    }

    static #buildModalFooterYesButtonDom(configuration, formId) {
        const modalFooterYesButton = document.createElement('button');
        modalFooterYesButton.setAttribute('class', configuration.yes.class);
        modalFooterYesButton.setAttribute('form', formId);
        modalFooterYesButton.setAttribute('type', 'submit');
        modalFooterYesButton.textContent = configuration.yes.text;

        return modalFooterYesButton;
    }

    static #buildModalHeaderDom(configuration) {
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');

        const modalTitle = inputModal.#buildModalTitleDom(configuration);
        modalHeader.appendChild(modalTitle);

        if (configuration.closeIcon) {
            const closeButton = inputModal.#buildModalCloseDom();
            modalHeader.appendChild(closeButton);
        }

        return modalHeader;
    }

    static #buildModalTitleDom(configuration) {
        const modalTitle = document.createElement('h5');
        modalTitle.classList.add('modal-title');
        modalTitle.textContent = configuration.title;

        return modalTitle;
    }

    static #buildModalCloseDom() {
        const closeButton = document.createElement('button');
        closeButton.classList.add('btn-close');
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.setAttribute('aria-label', 'close');

        return closeButton;
    }

    static #validateModalType(type) {
        const acceptableTypes = [
            'color',
            'date',
            'datetime-local',
            'email',
            'file',
            'month',
            'number',
            'password',
            'range',
            'search',
            'select',
            'tel',
            'text',
            'time',
            'url',
            'week'
        ];
        return acceptableTypes.includes(type);
    }

    static show(params) {
        // optionally setup the default parameters
        params = params || {};

        // build the modal DOM passing the configuration and get a reference to the buttons
        const modalDom = inputModal.#buildDom(params);
        const formModalBody = modalDom.querySelector('form.modal-body');

        // append the modal DOM to the body
        document.body.appendChild(modalDom);
        const modalPromise = new Promise((resolve, reject) => {
            // show the modal
            const bsModal = new bootstrap.Modal(modalDom);
            bsModal.show();

            // handle the yes click event
            formModalBody.addEventListener('submit', e => {
                e.preventDefault();

                const form = e.currentTarget;
                const elements = form.elements;
                const input = elements['input'];
                resolve(input.value);
                bsModal.hide();
            });

            // handle the dismiss events
            modalDom.addEventListener('hidden.bs.modal', () => {
                reject();
            });
        });

        return modalPromise;
    }
}

