/*
** Obs. Interfaces não são compiladas para o javascript, é um elemento do TypeScript
** Só é utilizado dentro do TypeScript e funciona como uma Class
*/
(function () {
    var _a;
    const $ = (query) => document.querySelector(query);
    function calcTempo(mil) {
        const min = Math.floor(mil / 60000);
        const sec = Math.floor((mil % 60000) / 1000);
        return `${min}m e  ${sec}s`;
    }
    function patio() {
        function ler() {
            /*
            ** o metodo ler foi tipado como um 'array de veiculo' para não permitir retorno do tipo 'any'
            ** Verificar se no localStorage existe a propriedade patio,
            ** se existir retorna o conteúdo, caso contrario retorna um array vazio
            */
            return localStorage.patio ? JSON.parse(localStorage.patio) : [];
        }
        function salvar(veiculos) {
            /*
            ** O metodo vai receber os dados segundo a interface Veiculo : nome, placa e entrada
            ** e adicionar a propriedade 'patio' um array de string com estas informações
            */
            localStorage.setItem("patio", JSON.stringify(veiculos));
        }
        function adicionar(veiculo, salva) {
            var _a, _b;
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td>
                <button class="delete" data-placa="${veiculo.placa}">X</button>
            </td>
            `;
            (_a = $("#patio")) === null || _a === void 0 ? void 0 : _a.appendChild(row);
            /*
            ** A linha abaixo verifica se ouve um clique no btn com a classe .delete e chama o metodo remover()
            ** passando por meio do this a informação contida em 'data-placa' que é a placa do veiculo
            */
            (_b = row.querySelector(".delete")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", function () {
                remover(this.dataset.placa);
            });
            /*
            ** Verifica se a variavel salva é true e chama o metodo salvar
            ** O metodo salvar receber os veiculos que foi carregado pelo metodo ler que resgata do localstorage
            ** e a variavel veiculo, passa as novas informações para o metodo salvar
            */
            if (salva)
                salvar([...ler(), veiculo]);
        }
        /*
        ** O metodo remover, vai receber a placa que retorna addEventListner .delete
        ** vai acessar o metodo ler() que vai ler as informações no localstorage.patio
        ** e verificar se a placa existe e ver quanto tempo o veiculo ficou estacionado no patio
        */
        function remover(placa) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa);
            //A variavel 'tempo', vai receber o data atual em milesegundos menos a data retornada na variavel 'entrada'
            const tempo = calcTempo(new Date().getTime() - new Date(entrada).getTime());
            if (!confirm(`O veiculo ${nome} permaneceu por ${tempo}. Deseja encerrar?`))
                return;
            salvar(ler().filter((veiculo) => veiculo.placa !== placa));
            render();
        }
        function render() {
            /*
            ** O metodo vai acessar o tbody de id='patio', vai esvaziar qualquer informação que estiver nele
            ** e vai fazer um loop for, de todos os carros que ele encontrar no localstorage.patio
            ** obs. o '!' serve pra forçar um metodo, neste caso o typscritp estava dando erro por não ter certeza
            ** de que o objeto de id='patio' existe, mas como sabemos que existe usamos o ! para forçar.
            */
            $('#patio').innerHTML = ""; //Esvaziando as informações contidas neste objeto
            const patio = ler(); // Recebe as informações que estão gravadas no localstorage.patio
            /*
            ** Verifica se localstorage.patio não esta vazio
            ** Faz um loop foreach no array patio, chama o metodo  adicionar() para adicionar todos os veiculos ao tbody novamente
            */
            if (patio.length) {
                patio.forEach((veiculo) => adicionar(veiculo));
            }
        }
        return { ler, adicionar, remover, salvar, render };
    }
    /*
    ** Chama o metodo render quando iniciar o projeto
    ** O metodo vai acessar localstorage.patio e carregar as informaçõs no tbody do index.html
    ** Obs. o true no final, é para avisar que é para salvar, ou seja a variavel salva vai receber true
    */
    patio().render();
    (_a = $("#cadastrar")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        var _a, _b;
        const nome = (_a = $("#nome")) === null || _a === void 0 ? void 0 : _a.value;
        const placa = (_b = $("#placa")) === null || _b === void 0 ? void 0 : _b.value;
        if (!nome || !placa) {
            alert('Os campos nome e placa são obrigatórios');
            return;
        }
        patio().adicionar({ nome, placa, entrada: new Date().toISOString }, true);
    });
})();
