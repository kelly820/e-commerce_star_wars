
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const enviarBtn = document.getElementById('conteiner__btn');

    enviarBtn.addEventListener('click', function(event) {
        event.preventDefault(); // Evita o comportamento padrão de enviar o formulário

        // Verifica se todos os campos estão preenchidos
        if (nomeInput.value.trim() === '' || emailInput.value.trim() === '' || senhaInput.value.trim() === '') {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        // Constrói o objeto com os dados do formulário
        const dadosUsuario = {
            nome: nomeInput.value.trim(),
            email: emailInput.value.trim(),
            senha: senhaInput.value.trim()
        };

      
       //enviando dados para a minha API
        fetch('login_API.py', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosUsuario),
        })
        .then(response => {
            if (response.ok) {
                throw new ('Erro ao enviar dados para a API.');
            }
            // Se tudo der certo, redireciona para a próxima página
            alert('Usuário cadastrado com sucesso!');
            window.location.href = 'page_compras.html'; // Redireciona para a página de sucesso
        })
        
    });
});

