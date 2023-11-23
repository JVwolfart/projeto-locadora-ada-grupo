# projeto-locadora-ada-grupo

# Turma 1090 Vem Ser Tech Back End Ada iFood

## Integrantes do grupo

João Vitor Wolfart
Priscilla de Araújo
Pietra Almeida

## Professores

Dannyel Kayke
Rafael Costa

Sistema de locadora de veículos.

O desafio consiste no seguinte:

Desenvolvimento de Sistema para Locadora de Veículos

Contexto e Requisitos:
A equipe, composta por no mínimo 2 e no máximo 4 integrantes, foi contratada para desenvolver um sistema de locadora de veículos. Este sistema será projetado utilizando a linguagem de
programação TypeScript, ou no máximo JavaScript Vanilla, permitindo uma interface via terminal ou qualquer interface gráfica.


Regras de Negócio Estabelecidas pelo Cliente:

Cadastro de Veículos:

1. Não é permitido cadastrar veículos com a mesma placa de outro já registrado no sistema.

2. As informações a serem cadastradas dos veículos devem incluir o valor da hora de aluguel.

Aluguel de Veículos:

1. Para alugar um veículo, o cliente deve fornecer nome, CPF e o tipo de carteira.

2. Se o tipo de carteira do cliente for "A", ele só poderá alugar uma moto; se for "B", apenas um carro.

3. Cada cliente pode alugar apenas um veículo por vez, e não deve estar alugando nenhum outro veículo no momento de realizar um novo aluguel.

4. Ao alugar um veículo, deve-se realizar um cálculo considerando o valor da diária, os dias a serem alugados e um acréscimo conforme o tipo de veículo. Carros terão um acréscimo de 10%,
enquanto motos terão 5%.

Devolução de Veículos:

1. A devolução do veículo requer o fornecimento do CPF do cliente e a placa do veículo.
2. Não é permitido excluir um veículo que esteja atualmente alugado.

Faturamento:

O sistema, quando solicitado, deve apresentar a fatura a ser paga pelo cliente, detalhando o custo do aluguel de cada veículo.

Funcionalidades do Sistema

Cadastrar veículo
Alugar veículo
Devolver veículo
Listar veículos disponíveis
Listar veículos alugados
Mostrar fatura do cliente
Sair do sistema

Entrega do Projeto:

•O código fonte do projeto deve ser desenvolvido em TypeScript ou, no máximo, em JavaScript
Vanilla.
•A interface pode ser implementada via terminal ou qualquer interface gráfica (HTML e CSS, por
exemplo).
•A equipe deve ser composta por no mínimo 2 e no máximo 4 integrantes.
•O código deve ser entregue via link de repositório remoto (por exemplo, GitHub) ou em arquivo
zipado.
•A entrega deve ser feita através do sistema escolar LMS designado para este curso.
•Observação: Certifique-se de seguir as boas práticas de desenvolvimento, documentação
adequada e teste do código antes da entrega.

Como o nosso grupo desenvolveu o sistema:

Utilizamos a linguagem de programação TypeScript, e desenvolvemos com a interface de terminal. Como nos requisitos não havia utilização de banco de dados, optamos por fazer a persistência dos dados através de arquivos texto.

Inicialmente, o sistema deve carregar os arquivos de texto que contêm os dados, e ao encerrar o sistema, deve salvar estes dados em seus respectivos arquivos texto, para a recuperação na próxima vez que for utilizar o sistema.

Optamos por criar as classes básicas de:

TipoCarteira: Classe encarregada de cuidar dos tipos de carteira que o sistema vai aceitar (inicialmente apenas A e B, conforme o requisito solicitado, podendo ampliar para cadastro de novas carteiras, caso haja necessidade).
TipoVeiculo: Classe encarregada de cuidar dos tipos de veículos que serão disponibilizados (carros, motos, ou outro tipo que venha a ser utilizado).
Veiculo: Classe encarregada de cuidar dos veículos.
Cliente: Classe encarregada de cuidar do cadastro de clientes.
Locacao: Classe encarregada de cuidar das locações, e dos detalhes práticos do negócio (como o controle das datas de locação e devolução dos veículos), além de cuidar também dos valores, tanto das diárias quanto dos acréscimos de cada locação, para então persistir esses dados no sistema, e proporcionar com esses dados, os históricos, e também, os controles de fluxo de aluguéis do sistema.
Locadora: Classe principal do sistema, que controla os dados, e a manipulação dos dados no sistema.

Nosso sistema possui as seguintes funcionalidades:

1 - Cadastrar tipo de carteira
2 - Cadastrar tipo de veículo
3 - Cadastrar veículo
4 - Cadastrar cliente
5 - Registrar locação
6 - Registrar devolução
7 - Emitir fatura cliente por CPF
8 - Emitir fatura por id
9 - Remover/dar baixa em veículo
10 - Remover/inativar cliente
11 - Reativar veículo
12 - Reativar cliente
13 - Listar todos os veículos (exceto baixados)
14 - Listar veículos disponíveis
15 - Listar veículos indisponíveis (em locação)
16 - Listar veículos baixados (removidos)
17 - Listar clientes inativos (removidos)
18 - Histórico de locações de clientes ativos
19 - Histórico de locações de clientes inativos
0 - Sair do sistema

Optamos por não fazer a exclusão de veículos e clientes, para assim poder persistir um histórico.

Então, ao invés de exclusão, criamos uma flag para indicar se o veículo está baixado, que seria semelhante a ele estar excluído, porém, não impede de ele aparecer nos dados de históricos passados, apenas impede que ele seja locado novamente.

Da mesma forma, funciona com os clientes, criamos uma flag que indica se ele está ativo ou inativo, sendo a opção inativo, semelhante a se ele estivesse excluído do sistema, não permitindo a eles novas locações, porém permitindo o acesso aos históricos das locações, que por ventura ele já tenha feito antes de ter sido excluído/inativado.

Aproveitando também, criamos as opções de reativar clientes e reativar veículos. O cliente uma vez reativado voltará a ser um cliente que pode alugar veículos, e fazer tudo normalmente. Da mesma forma, o veículo, se for reativado, será possível alugá-lo novamente.

IMPORTANTE: Se o veículo estiver sendo alugado por algum cliente, ele não poderá ser baixado. Da mesma forma, se o cliente não tiver devolvido o veículo que ele alugou, não poderá ser inativado. Ou seja, o cliente para ser inativado, é necessário que não esteja com nenhuma locação em andamento, e o veículo para ser baixado, é necessário estar disponível para locação.

O faturamento só pode ocorrer após a devolução do veículo, portanto, veículos em locação não podem ter a fatura emitida. Para emitir, é necessário primeiro fazer a devolução do veículo.

Quanto a devolução do veículo, não é permitido devolver um veículo com data posterior a data atual.

Emissão da fatura:

Após o cliente devolver o veículo, já é possível emitir a fatura. No momento da emissão da fatura, o sistema apresenta o histórico com todas as locações possíveis de emitir fatura que o cliente tenha em seu histórico. Bastando o usuário selecionar qual locação do cliente ele deseja emitir a fatura (e podendo também reemitir faturas de locações anteriores do cliente).

Na fatura, é informado os seguintes dados:

                                DADOS DA LOCAÇÃO

    Nº da fatura
    Data da locação
    Data da devolução
    Quantidade de dias da locação
    Veículo alugado
    Valor da diária
    Placa do veículo
    --------------------------------------------------------------------------------

                              DADOS DO CLIENTE
    
    Nome do cliente
    CPF do cliente
    Tipo de habilitação
    --------------------------------------------------------------------------------

                            CÁLCULO DOS VALORES

    Valor da diária
    Quantidade de dias
    Total das diárias
    Acréscimo referente a impostos do tipo de veículo
    Total do acréscimo
    Valor total da fatura

Basicamente, com isso, acreditamos que foi possível superar o desafio proposto, e entregar todas as funcionalidades solicitadas no escopo do projeto.

Bibliotecas utilizadas no sistema:

"devDependencies": {
    "@types/node": "20.9.2",
    "typescript": "5.2.2"
  },
  "dependencies": {
    "cli-table": "0.3.11",
    "colors": "1.4.0",
    "figlet": "1.7.0",
    "fs": "0.0.1-security",
    "readline-sync": "1.4.10",
    "system-sleep": "1.3.7"
  }
