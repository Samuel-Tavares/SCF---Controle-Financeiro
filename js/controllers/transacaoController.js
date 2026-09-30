export function inicializarTransacaoController() {
    const formulario = document.querySelector('#form-nova-transacao');

    formulario.addEventListener('submit', function(evento) {
        evento.preventDefault();
        console.log('Formulario enviado!');
    });
}