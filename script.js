
const produtos = {

    1: {
        nome: "Açaí Tradicional",
        preco: 14.90,
        imagem: "imagens/acai1.jpg",
        descricao:
            "Açaí cremoso para você montar do seu jeito."
    },

    2: {
        nome: "Açaí com Morango",
        preco: 17.90,
        imagem: "imagens/acai2.jpg",
        descricao:
            "Açaí cremoso acompanhado de morangos frescos."
    },

    3: {
        nome: "Açaí Especial",
        preco: 21.90,
        imagem: "imagens/acai3.jpg",
        descricao:
            "Uma combinação especial para deixar seu momento ainda melhor."
    }

};


/* ================= CARRINHO ================= */

let carrinho =
    JSON.parse(localStorage.getItem("rootsCarrinho")) || [];


let produtoAtual = null;


/* ================= FORMATAÇÃO ================= */

function formatarMoeda(valor) {

    return valor.toLocaleString("pt-BR", {

        style: "currency",

        currency: "BRL"

    });

}


/* ================= PRODUTO ================= */

function abrirProduto(id) {

    produtoAtual = produtos[id];

    if (!produtoAtual) return;


    document.getElementById("modalTitulo").textContent =
        produtoAtual.nome;


    document.getElementById("modalDescricao").textContent =
        produtoAtual.descricao;


    document.getElementById("modalImagem").src =
        produtoAtual.imagem;


    document.getElementById("modalImagem").alt =
        produtoAtual.nome;


    document.querySelectorAll(
        '#modalProduto input[type="checkbox"]'
    ).forEach(input => {

        input.checked = false;

    });


    const tamanho300 =
        document.querySelector(
            '#modalProduto input[value="300"]'
        );

    if (tamanho300) {

        tamanho300.checked = true;

    }


    atualizarTotalModal();


    document.getElementById("modalProduto")
        .classList.add("active");


    document.body.style.overflow = "hidden";

}


function fecharProduto() {

    document.getElementById("modalProduto")
        .classList.remove("active");


    document.body.style.overflow = "";

}


/* ================= TOTAL DO PRODUTO ================= */

function atualizarTotalModal() {

    if (!produtoAtual) return;


    const tamanhoSelecionado =
        document.querySelector(
            '#modalProduto input[name="tamanho"]:checked'
        );


    let total = produtoAtual.preco;


    if (tamanhoSelecionado) {

        const tamanho =
            tamanhoSelecionado.value;


        if (tamanho === "500") {

            total += 4;

        }


        if (tamanho === "700") {

            total += 7;

        }

    }


    document.querySelectorAll(
        '#modalProduto .adicionais input:checked'
    ).forEach(input => {

        total += Number(input.value);

    });


    document.getElementById("modalTotal")
        .textContent =
        formatarMoeda(total);

}


/* ================= ADICIONAR AO CARRINHO ================= */

function adicionarAoCarrinho() {

    if (!produtoAtual) return;


    const tamanhoSelecionado =
        document.querySelector(
            '#modalProduto input[name="tamanho"]:checked'
        );


    const tamanho =
        tamanhoSelecionado
            ? tamanhoSelecionado.value
            : "300";


    let total =
        produtoAtual.preco;


    if (tamanho === "500") {

        total += 4;

    }


    if (tamanho === "700") {

        total += 7;

    }


    const adicionais = [];


    document.querySelectorAll(
        '#modalProduto .adicionais input:checked'
    ).forEach(input => {

        adicionais.push({
            nome: input.dataset.nome,
            preco: Number(input.value)
        });

        total += Number(input.value);

    });


    const item = {

        id: Date.now(),

        produto: produtoAtual.nome,

        tamanho: `${tamanho}ml`,

        adicionais: adicionais,

        preco: total,

        quantidade: 1

    };


    carrinho.push(item);


    salvarCarrinho();

    atualizarCarrinho();


    fecharProduto();


    abrirCarrinho();


}


/* ================= SALVAR ================= */

function salvarCarrinho() {

    localStorage.setItem(
        "rootsCarrinho",
        JSON.stringify(carrinho)
    );

}


/* ================= CONTADOR ================= */

function atualizarContador() {

    const contador =
        document.getElementById(
            "contadorCarrinho"
        );


    if (!contador) return;


    const quantidade =
        carrinho.reduce(
            (total, item) =>
                total + item.quantidade,
            0
        );


    contador.textContent =
        quantidade;

}


/* ================= ABRIR CARRINHO ================= */

function abrirCarrinho() {

    const modal =
        document.getElementById(
            "modalCarrinho"
        );


    if (!modal) return;


    atualizarCarrinho();


    modal.classList.add("active");


    document.body.style.overflow =
        "hidden";

}


function fecharCarrinho() {

    const modal =
        document.getElementById(
            "modalCarrinho"
        );


    if (!modal) return;


    modal.classList.remove("active");


    document.body.style.overflow =
        "";

}


/* ================= RENDER CARRINHO ================= */

function atualizarCarrinho() {

    atualizarContador();


    const lista =
        document.getElementById(
            "listaCarrinho"
        );


    const vazio =
        document.getElementById(
            "carrinhoVazio"
        );


    const totalElemento =
        document.getElementById(
            "totalCarrinho"
        );


    if (!lista) return;


    lista.innerHTML = "";


    if (carrinho.length === 0) {

        if (vazio) {

            vazio.style.display =
                "block";

        }


        if (totalElemento) {

            totalElemento.textContent =
                "R$ 0,00";

        }


        return;

    }


    if (vazio) {

        vazio.style.display =
            "none";

    }


    let totalGeral = 0;


    carrinho.forEach(item => {

        const subtotal =
            item.preco *
            item.quantidade;


        totalGeral += subtotal;


        const adicionais =
            item.adicionais.length > 0

                ? item.adicionais
                    .map(adicional =>
                        adicional.nome
                    )
                    .join(", ")

                : "Sem adicionais";


        const div =
            document.createElement("div");


        div.className =
            "item-carrinho";


        div.innerHTML = `

            <div class="item-info">

                <strong>
                    ${item.produto}
                </strong>

                <small>
                    ${item.tamanho}
                    •
                    ${adicionais}
                </small>

            </div>


            <div class="quantidade">

                <button
                    onclick="alterarQuantidade(${item.id}, -1)"
                    aria-label="Diminuir quantidade">
                    −
                </button>

                <span>
                    ${item.quantidade}
                </span>

                <button
                    onclick="alterarQuantidade(${item.id}, 1)"
                    aria-label="Aumentar quantidade">
                    +
                </button>

            </div>


            <div class="item-preco">

                ${formatarMoeda(subtotal)}

            </div>


            <button
                class="btn-remover"
                onclick="removerItem(${item.id})"
                aria-label="Remover item">

                🗑️

            </button>

        `;


        lista.appendChild(div);

    });


    if (totalElemento) {

        totalElemento.textContent =
            formatarMoeda(totalGeral);

    }

}


/* ================= QUANTIDADE ================= */

function alterarQuantidade(id, quantidade) {

    const item =
        carrinho.find(
            item => item.id === id
        );


    if (!item) return;


    item.quantidade += quantidade;


    if (item.quantidade <= 0) {

        carrinho =
            carrinho.filter(
                item => item.id !== id
            );

    }


    salvarCarrinho();

    atualizarCarrinho();

}


/* ================= REMOVER ================= */

function removerItem(id) {

    carrinho =
        carrinho.filter(
            item => item.id !== id
        );


    salvarCarrinho();

    atualizarCarrinho();

}


/* ================= WHATSAPP ================= */

function finalizarPedido() {

    if (carrinho.length === 0) {

        alert(
            "Seu carrinho está vazio!"
        );

        return;

    }


    /*
       TROQUE ESTE NÚMERO PELO WHATSAPP
       REAL DA ROOTS AÇAÍ.

       Exemplo:
       5531999999999
    */

    const telefone =
        "5531999999999";


    let mensagem =
        "Olá! Quero fazer um pedido na Roots Açaí 🍇💜%0A%0A";


    let total = 0;


    carrinho.forEach((item, index) => {

        const subtotal =
            item.preco *
            item.quantidade;


        total += subtotal;


        const adicionais =
            item.adicionais.length > 0

                ? item.adicionais
                    .map(a => a.nome)
                    .join(", ")

                : "Sem adicionais";


        mensagem +=
            `${index + 1}. ${item.produto}%0A`;


        mensagem +=
            `Tamanho: ${item.tamanho}%0A`;


        mensagem +=
            `Adicionais: ${adicionais}%0A`;


        mensagem +=
            `Quantidade: ${item.quantidade}%0A`;


        mensagem +=
            `Subtotal: ${formatarMoeda(subtotal)}%0A%0A`;

    });


    mensagem +=
        `*TOTAL: ${formatarMoeda(total)}*`;


    const url =
        `https://wa.me/${telefone}?text=${mensagem}`;


    window.open(
        url,
        "_blank"
    );

}


/* ================= MENU MOBILE ================= */

function alternarMenu() {

    const nav =
        document.getElementById("nav");


    if (nav) {

        nav.classList.toggle("active");

    }

}


/* ================= MOSTRAR SENHA ================= */

function mostrarSenha(id, botao) {

    const input =
        document.getElementById(id);


    if (!input) return;


    if (input.type === "password") {

        input.type = "text";

        botao.textContent = "🙈";

    } else {

        input.type = "password";

        botao.textContent = "👁️";

    }

}


/* ================= LOGIN ================= */

const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const senha =
                document.getElementById(
                    "loginSenha"
                ).value;


            const usuario =
                JSON.parse(
                    localStorage.getItem(
                        "rootsUsuario"
                    )
                );


            if (
                !usuario ||
                usuario.email !== email ||
                usuario.senha !== senha
            ) {

                alert(
                    "E-mail ou senha incorretos."
                );

                return;

            }


            alert(
                `Bem-vindo(a), ${usuario.nome}! 💜`
            );


            window.location.href =
                "index.html";

        }
    );

}


/* ================= CADASTRO ================= */

const cadastroForm =
    document.getElementById(
        "cadastroForm"
    );


if (cadastroForm) {

    cadastroForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const nome =
                document.getElementById(
                    "cadNome"
                ).value.trim();


            const email =
                document.getElementById(
                    "cadEmail"
                ).value.trim();


            const senha =
                document.getElementById(
                    "cadSenha"
                ).value;


            const confirmar =
                document.getElementById(
                    "cadConfirmar"
                ).value;


            if (senha !== confirmar) {

                alert(
                    "As senhas não são iguais."
                );

                return;

            }


            if (senha.length < 6) {

                alert(
                    "A senha precisa ter pelo menos 6 caracteres."
                );

                return;

            }


            const usuario = {

                nome: nome,

                email: email,

                senha: senha

            };


            localStorage.setItem(
                "rootsUsuario",
                JSON.stringify(usuario)
            );


            alert(
                "Conta criada com sucesso! 💜"
            );


            window.location.href =
                "login.html";

        }
    );

}


/* ================= ESQUECI SENHA ================= */

function esqueciSenha() {

    const email =
        prompt(
            "Digite o e-mail cadastrado:"
        );


    if (!email) return;


    const usuario =
        JSON.parse(
            localStorage.getItem(
                "rootsUsuario"
            )
        );


    if (
        usuario &&
        usuario.email === email
    ) {

        alert(
            "No site real, aqui seria enviado um link para redefinir sua senha."
        );

    } else {

        alert(
            "E-mail não encontrado."
        );

    }

}


/* ================= ACESSIBILIDADE ================= */

let tamanhoFonte = 100;


/* AUMENTAR TEXTO */

function aumentarTexto() {

    if (tamanhoFonte >= 140) {

        return;

    }


    tamanhoFonte += 10;


    aplicarFonte();

}


/* DIMINUIR TEXTO */

function diminuirTexto() {

    if (tamanhoFonte <= 80) {

        return;

    }


    tamanhoFonte -= 10;


    aplicarFonte();

}


/* APLICAR TAMANHO */

function aplicarFonte() {

    document.documentElement.style.fontSize =
        `${tamanhoFonte}%`;

}


/* LER PÁGINA */

function lerPagina() {

    if (!("speechSynthesis" in window)) {

        alert(
            "Seu navegador não suporta leitura de texto."
        );

        return;

    }


    window.speechSynthesis.cancel();


    const texto =
        document.body.innerText;


    const fala =
        new SpeechSynthesisUtterance(texto);


    fala.lang =
        "pt-BR";


    fala.rate =
        0.95;


    fala.pitch =
        1;


    window.speechSynthesis.speak(
        fala
    );

}


/* PAUSAR */

function pausarAudio() {

    if (
        "speechSynthesis" in window &&
        window.speechSynthesis.speaking
    ) {

        window.speechSynthesis.pause();

    }

}


/* CONTINUAR */

function continuarAudio() {

    if (
        "speechSynthesis" in window &&
        window.speechSynthesis.paused
    ) {

        window.speechSynthesis.resume();

    }

}


/* PARAR */

function pararAudio() {

    if (
        "speechSynthesis" in window
    ) {

        window.speechSynthesis.cancel();

    }

}


/* ALTO CONTRASTE */

function alternarContraste() {

    document.body.classList.toggle(
        "alto-contraste"
    );


    const ativo =
        document.body.classList.contains(
            "alto-contraste"
        );


    localStorage.setItem(
        "rootsContraste",
        ativo
    );

}


/* ================= MODAIS ================= */

document.addEventListener(
    "click",
    function(event) {

        const modalProduto =
            document.getElementById(
                "modalProduto"
            );


        const modalCarrinho =
            document.getElementById(
                "modalCarrinho"
            );


        if (
            event.target === modalProduto
        ) {

            fecharProduto();

        }


        if (
            event.target === modalCarrinho
        ) {

            fecharCarrinho();

        }

    }
);


document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            fecharProduto();

            fecharCarrinho();

        }

    }
);


/* ================= INICIALIZAÇÃO ================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        atualizarCarrinho();


        const contraste =
            localStorage.getItem(
                "rootsContraste"
            );


        if (contraste === "true") {

            document.body.classList.add(
                "alto-contraste"
            );

        }

    }
);