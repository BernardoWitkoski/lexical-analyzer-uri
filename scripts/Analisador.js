class Analisador{

    init() {
        this.MaterializeChips = new MaterializeChips();
        this.MaterializeChips.init();
        this.recupera_token ();
    }

    estado_inicial = 0;
    tabela = [];
    estados = [[]];

    constructor() {
        this.tabela = [];
        this.estados = [[]];
        this.MaterializeChips = undefined;
    }

    get table() {
        const table = document.getElementById('tabela');
        return table;
    }
    
    set estados(estadosList) {
        this.estados = estadosList;
    }
    
    get estados() {
        return this.estados;
    }

    recupera_token () {
        let entrada = document.getElementById('token');
        entrada.addEventListener('keyup', 
        this.valida_token
        .bind(null,this), false);
    }

    valida_token($this) {

        let tamanho_token = $this.MaterializeChips.chips.length;

        if (tamanho_token > 0) {

            let token = document.getElementById('token').value.toLowerCase();
            let linhas = document.querySelectorAll('tr');
            let colunas = document.querySelectorAll('td');
            let atual = 0;
            let erro = false;
            let i;

            if (token.length == 0) {
                linhas.forEach((line)=> {line.classList.remove('linha')});
                colunas.forEach((column) => {column.classList.remove('coluna')});

                // console.log(tableLines);
                // console.log(tableColumns);
            }
 
            for (i = 0; i < token.length; i++) {
                let regex = /([a-z_])/;

                if (regex.test(token[i]) && erro !== true){
                    // console.log($this.tabela);
                    $this.buscador_tabela(atual, token[i], $this.tabela[atual][token[i]]);
                    
                    if ($this.tabela[atual][token[i]] != '-'){
                        atual = $this.tabela[atual][token[i]];
                    } else { 
                        erro = true;
                    }
                } else if (token[i] == ' ' || token[i] == '/n'){
                    let token_chip = $this.MaterializeChips.getElementChipByTag(token.replace(/^\s+|\s+$/g, ''));
                    
                    if (token_chip != undefined){
                        let entrada = document.getElementById('token');
                        
                        entrada.value = '';
                        
                        Analisador.remover_efeito();
                        
                        $this.token_verificado_efeito(token_chip);
                    }
                } else if (erro !== true) {
                    alert("Digite apenas caracteres sem símbolos especiais");
                }
            }
        }
    };

    adicionar_tabela() {
        this.montar_palavra();
        this.tabela = this.adiciona_linha();
        this.montar_tabela(this.tabela);
    }

    montar_palavra() {
        const token = this.MaterializeChips.chips;
        let i;
        let p;
        
        for (i = 0; i < token.length; i++) {
            let atual = 0;
            let palavra = token[i].tag;


            for (p = 0; p < palavra.length; p++){
                if (typeof this.estados[atual][palavra[p]] === 'undefined'){
                    let proximo = this.estado_inicial + 1;

                    this.estados[atual][palavra[p]] = proximo;
                    this.estados[proximo] = [];
                    this.estado_inicial = atual = proximo;

                } else {
                    atual = this.estados[atual][palavra[p]];
                }
    
                if (p == palavra.length - 1){
                    this.estados[atual]['finished'] = true;
                }
            }
        }
    }

    adiciona_linha() {
        let linha = [];
        let i;

        for (i = 0; i < this.estados.length; i++) {
            let x = [];
            x['state'] = i;

            // console.log(aux);
            let primeiro_simbolo = 'a';
            let ultimo_simbolo = 'z';

            var p;

            for (p = primeiro_simbolo.charCodeAt(0); p <= ultimo_simbolo.charCodeAt(0); p++) {
                let simbolo = String.fromCharCode(p);
                if (typeof this.estados[i][simbolo] === 'undefined'){
                    x[simbolo] = '-';
                } else {
                    x[simbolo] = this.estados[i][simbolo];
                }
            }
            if (typeof this.estados[i]['finished'] !== 'undefined'){
                x['finished'] = true;
            }
            linha.push(x);
        }

        return linha;
    }

    montar_tabela(tabela) {

        let conteudo_tabela = this.table.children[1];
        let i;

        // retorna texto e espaço
        conteudo_tabela.innerHTML = '';
        for (i = 0; i < tabela.length; i++){
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            
            if (tabela[i]['finished']){
                td.innerText = 'q' + tabela[i]['state'] + '*';
            } else {
                td.innerText = 'q' + tabela[i]['state'];
            }
            td.classList.add('tem-sel');
            td.classList.add('center');
            td.classList.add('border-custom');

            tr.append(td);
            tr.classList.add('line_' + tabela[i]['state']);

            let primeiro_simbolo = 'a';
            let ultimo_simbolo = 'z';

            let p;

            for (p = primeiro_simbolo.charCodeAt(0); p <= ultimo_simbolo.charCodeAt(0); p++) {
                let simbolo_atual = String.fromCharCode(p);
                let td = document.createElement('td');
                
                td.classList.add('column_' + simbolo_atual);
                td.classList.add('center');

                if (tabela[i][simbolo_atual] != '-'){
                    td.innerText = 'q' + tabela[i][simbolo_atual];
                    td.classList.add('tem-sel');
                } else {
                    td.innerText = '-';
                    td.classList.add('border-custom');
                }

                tr.append(td);
            }

            conteudo_tabela.append(tr);
	    }
    }

    static remover_efeito() {
        let linhas = document.querySelectorAll('tr');
        let colunas = document.querySelectorAll('td');
        
        linhas.forEach((line)=>{
            line.classList.remove('linha');
            line.classList.remove('coluna-nao-encontrada')
        });
        
        colunas.forEach((column) => {
            column.classList.remove('coluna');
            column.classList.remove('coluna-nao-encontrada');

        });
        
    }

    static adicionar_efeito(state, char, stateError) {
        let linha = document.querySelectorAll('.line_' + state);
        let coluna = document.querySelectorAll('.column_' + char);

        // console.log('line');
        console.log(JSON.stringify(stateError));

        if (stateError == '-') {
            linha.forEach((line) => {line.classList.add('coluna-nao-encontrada')});
            coluna.forEach((column) => {column.classList.add('coluna-nao-encontrada')});
        } else {
            linha.forEach((line) => {line.classList.add('linha')});
            coluna.forEach((column) => {column.classList.add('coluna')});
        }
    }

    buscador_tabela(atual, token, erro) {
        Analisador.remover_efeito();
        Analisador.adicionar_efeito(atual, token, erro);
    };

    token_verificado_efeito(element) {
        element.classList.add('token-verificado');
    }

}

class MaterializeChips {
    
    constructor(){};

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            let elems = document.querySelectorAll('.chips');
            let options = {
                placeholder: 'Digite o token',
            }
            M.Chips.init(elems, options);
        });
    }

    get chips() {
        let chips = this.instance.chipsData;
        return chips;
    }

    getElementChipByTag(tagName) {
        var indexTag = undefined;

        for(let i = 0; i < this.chips.length; i++){
            let name = this.chips[i].tag;
            
            console.log(tagName, '=', name);
            console.log(tagName == name);
            if (tagName == name){
                console.log(this.chips[i].tag);
                indexTag = i;
            }
        }
        console.log(indexTag);
        console.log(this.instance.$chips);

        return this.instance.$chips[indexTag];
    }

    get instance() {
        const chips = document.querySelectorAll('#chips');
        let instance = chips[0].M_Chips;

        return instance;
    }
}