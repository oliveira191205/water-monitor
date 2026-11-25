# 💧 Water Monitor — Sistema de Monitoramento de Reservatório

Projeto acadêmico de Internet das Coisas (IoT), desenvolvido para monitorar o nível de água de um reservatório por meio da integração de um sensor ultrassônico, um microcontrolador ESP32, uma API REST, um banco de dados em nuvem e um painel de monitoramento web.

## 🎯 Objetivo

Desenvolver um sistema capaz de monitorar o nível de água de um reservatório, realizar a coleta automática de informações por meio de um sensor ultrassônico, armazenar as medições em um banco de dados na nuvem e disponibilizar os resultados em uma interface web.

A solução permite acompanhar o percentual de água disponível, identificar situações de nível baixo, verificar o estado da comunicação com o dispositivo e consultar o histórico das leituras realizadas.

O objetivo é demonstrar a aplicação prática dos conceitos de Internet das Coisas, integrando hardware, comunicação de dados, serviços em nuvem e desenvolvimento web.

## 🏗️ Arquitetura do projeto

O sistema funciona por meio da integração dos seguintes componentes:

1. **Sensor ultrassônico HC-SR04:** realiza a medição da distância entre o sensor e a superfície da água no reservatório.
2. **ESP32:** recebe as informações do sensor, calcula o percentual de água disponível e envia os dados para a API.
3. **API REST:** recebe as requisições enviadas pelo ESP32 e disponibiliza as informações para armazenamento e consulta.
4. **Supabase:** realiza o armazenamento persistente das leituras em banco de dados na nuvem.
5. **Frontend Web:** apresenta os dados do monitoramento por meio de indicadores, alertas, gráfico e histórico de registros.

### Fluxo de funcionamento

```text
Sensor HC-SR04
      |
      v
    ESP32
      |
      v
   API REST
      |
      v
   Supabase
      |
      v
  Frontend Web
      |
      v
 Visualização dos dados
```

## 🛠️ Tecnologias utilizadas

- **ESP32:** microcontrolador responsável pela comunicação e processamento das informações.
- **Sensor ultrassônico HC-SR04:** utilizado para medir a distância até a superfície da água.
- **Wokwi:** plataforma de simulação do circuito eletrônico e do funcionamento do ESP32.
- **C++:** linguagem utilizada na programação do microcontrolador.
- **API REST com HTTPS:** responsável pela comunicação e transferência das informações.
- **Supabase:** plataforma utilizada para armazenamento dos dados na nuvem.
- **HTML5:** estruturação da interface web.
- **CSS3:** estilização e organização visual do painel.
- **JavaScript:** implementação da lógica de consulta e atualização das informações.
- **Chart.js:** biblioteca utilizada para a representação gráfica do histórico das medições.
- **GitHub:** versionamento e hospedagem do código-fonte.
- **GitHub Pages:** publicação e disponibilização do painel web.

## ⚙️ Funcionamento

O sensor ultrassônico HC-SR04 realiza medições da distância entre sua posição de instalação e a superfície da água no reservatório.

O ESP32 recebe essas medições e utiliza os valores obtidos para calcular o percentual de água disponível. Para esse cálculo, foram estabelecidos os seguintes parâmetros:

- **Reservatório vazio:** distância de 45 cm.
- **Reservatório cheio:** distância de 5 cm.
- **Alerta de nível baixo:** percentual inferior a 20%.

Após o processamento, os dados são organizados em formato JSON e enviados por meio de uma requisição HTTPS para a API REST hospedada no Supabase.

A API recebe as informações e realiza o armazenamento no banco de dados, permitindo que as medições permaneçam registradas e possam ser consultadas posteriormente.

O frontend web realiza consultas periódicas à API, atualizando as informações apresentadas no painel de monitoramento.

### Funcionalidades do painel web

O painel apresenta os seguintes recursos:

- **Nível do reservatório:** exibe o percentual de água disponível.
- **Distância do sensor:** apresenta a distância medida pelo sensor ultrassônico.
- **Identificação do dispositivo:** informa qual dispositivo está realizando o monitoramento.
- **Última atualização:** apresenta a data e o horário da leitura mais recente.
- **Status da conexão:** indica se os dados recebidos estão atualizados ou desatualizados.
- **Gráfico de monitoramento:** permite visualizar a variação das medições ao longo do tempo.
- **Histórico de leituras:** apresenta os registros armazenados, com data, horário, nível, distância e condição identificada.
- **Alerta de nível baixo:** sinaliza quando o percentual de água está abaixo de 20%.
- **Aviso de dados desatualizados:** informa quando o sistema deixa de receber novas leituras dentro do intervalo esperado.

## 🚀 Como executar o projeto

### 1. Simulação do ESP32

1. Acesse o projeto no Wokwi pelo link disponibilizado na seção de links.
2. Inicie a simulação do circuito.
3. Verifique a conexão Wi-Fi do ESP32.
4. Acompanhe as medições realizadas pelo sensor.
5. Observe o Monitor Serial para verificar as informações enviadas e as respostas recebidas da API.

### 2. Configuração da API

O projeto utiliza uma API REST hospedada no Supabase.

**Endpoint utilizado:**

`https://hctuxkfpmvyasmewelsv.supabase.co/functions/v1/monitoramento-reservatorio`

A função recebe as leituras enviadas pelo ESP32, valida os dados recebidos e realiza o armazenamento das informações no banco de dados. Também permite consultar as leituras registradas, que são utilizadas pelo frontend para apresentar os dados do monitoramento.

As configurações e credenciais necessárias para a execução devem ser fornecidas separadamente. Chaves secretas, senhas e informações privadas não devem ser publicadas no repositório.

### 3. Execução do frontend localmente

1. Baixe ou clone este repositório.
2. Abra a pasta do projeto.
3. Localize o arquivo `index.html`.
4. Abra o arquivo em um navegador.
5. Aguarde o carregamento das informações consultadas pela API.

### 4. Acesso ao painel publicado

O frontend também está disponível publicamente por meio do GitHub Pages, permitindo acessar o painel de monitoramento diretamente pelo navegador, sem necessidade de executar os arquivos localmente.

**Link de acesso:**

[https://oliveira191205.github.io/water-monitor/](https://oliveira191205.github.io/water-monitor/)

## 🧪 Testes realizados

Foram realizados testes para verificar o funcionamento dos principais recursos do sistema e o comportamento da integração entre o dispositivo, a API, o banco de dados e o frontend.

| Teste | Resultado |
| ------------------------------------------- | --------- |
| Funcionamento normal do monitoramento | Realizado |
| Atualização do nível de água conforme as medições | Realizado |
| Alerta para nível abaixo de 20% | Realizado |
| Interrupção da comunicação com o dispositivo | Realizado |
| Identificação de dados desatualizados | Realizado |
| Recuperação da comunicação | Realizado |
| Persistência dos dados após fechar o painel | Realizado |

Durante os testes, foram identificadas falhas intermitentes em algumas tentativas de comunicação HTTPS, embora também tenham ocorrido envios concluídos com sucesso. Foram observadas, ainda, leituras inválidas quando a distância medida ultrapassou a faixa configurada para o reservatório.

Essas situações foram consideradas na avaliação do funcionamento e das limitações da solução desenvolvida.

## 🔗 Links do projeto

- **Repositório GitHub:** [https://github.com/oliveira191205/water-monitor](https://github.com/oliveira191205/water-monitor)
- **Projeto Wokwi:** [https://wokwi.com/projects/481523852271733761](https://wokwi.com/projects/481523852271733761)
- **Painel Web:** [https://oliveira191205.github.io/water-monitor/](https://oliveira191205.github.io/water-monitor/)
- **Vídeo de demonstração:** [https://youtu.be/zf5F1mVesUc]

## 👥 Integrantes e contribuições

O projeto Water Monitor foi desenvolvido de forma colaborativa, com a divisão das atividades entre os integrantes da equipe, contemplando a implementação da comunicação entre os dispositivos, o armazenamento dos dados, o desenvolvimento da interface web e a documentação da solução.

- **Felipe Meireles:** responsável pelo desenvolvimento do código-fonte do ESP32, por meio do arquivo sketch.ino, utilizando a linguagem C++. Sua contribuição envolveu a programação do microcontrolador para realizar a leitura das informações fornecidas pelo sensor ultrassônico HC-SR04, processar as medições, calcular o percentual de água disponível no reservatório e estabelecer a comunicação com a API REST para o envio dos dados coletados. Essa etapa foi fundamental para o funcionamento lógico do dispositivo e para a integração entre o circuito eletrônico e os serviços em nuvem.

- **Larissa Vitória Custódio de Carvalho:** responsável pelo desenvolvimento da estrutura de armazenamento dos dados no Supabase e pela implementação da API responsável por receber, processar e disponibilizar as informações enviadas pelo ESP32. Sua contribuição envolveu a integração entre o dispositivo IoT, o serviço de backend e o banco de dados, permitindo que as medições realizadas pelo sensor fossem registradas e posteriormente consultadas pelo frontend. Também ficou responsável pela gravação do vídeo de demonstração do projeto, apresentando o funcionamento da solução e a integração entre seus componentes.

- **Marcela Buzzo de Oliveira:** responsável pelo desenvolvimento do frontend web e pela elaboração da documentação do projeto. Atuou na construção da interface de monitoramento, utilizando HTML, CSS e JavaScript, implementando a apresentação do nível de água do reservatório, da distância medida pelo sensor, da situação da conexão e da data e horário da última leitura. Também desenvolveu os recursos de visualização do histórico, incluindo gráfico e tabela de registros, além dos indicadores de alerta para nível baixo e de dados desatualizados. Na parte de documentação, ficou responsável pela organização das informações técnicas, descrição da arquitetura, registro dos testes realizados e estruturação das instruções de acesso e execução do sistema.

- **Nathan Nogueira:** responsável pela elaboração do arquivo diagram.json, utilizado na configuração e representação do circuito eletrônico na plataforma Wokwi. Sua contribuição envolveu a organização dos componentes utilizados na simulação, incluindo o ESP32 e o sensor ultrassônico HC-SR04, bem como a definição das conexões entre os pinos dos dispositivos. Esse arquivo permite reproduzir virtualmente a montagem do circuito e verificar a integração física entre os componentes do sistema.
## 📚 Considerações finais

O desenvolvimento do Water Monitor permitiu aplicar, de forma prática, conceitos relacionados à Internet das Coisas, programação de microcontroladores, comunicação entre dispositivos, integração com APIs REST, armazenamento de dados em nuvem e desenvolvimento de interfaces web.

A solução desenvolvida demonstra a possibilidade de monitorar um reservatório de água remotamente, disponibilizando informações sobre o nível de água, alertas e histórico das medições.

Além da implementação técnica, o projeto proporcionou a integração entre diferentes tecnologias e o trabalho colaborativo entre os integrantes da equipe, permitindo compreender as etapas necessárias para o desenvolvimento de uma aplicação IoT completa.

