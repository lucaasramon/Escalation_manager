# Simulador de Processos (FIFO, SJF, Prioridade e Round Robin)

Este projeto é um simulador de processos que implementa os algoritmos de escalonamento **FIFO (First In, First Out)**, **SJF (Shortest Job First)**, **Prioridade** e **Round Robin**. Foi desenvolvido utilizando **React**, **Next.js** e **TailwindCSS** para criar uma interface moderna e responsiva.

## Índice

- [Características do Projeto](#características-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Executar o Projeto](#como-executar-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Características do Projeto

- Simulação dos principais algoritmos de escalonamento de processos:
  - **FIFO (First In, First Out)**: Processos são executados na ordem em que chegam.
  - **SJF (Shortest Job First)**: Processos com menor tempo de execução são priorizados.
  - **Prioridade**: Cada processo tem uma prioridade associada e é escalonado com base nela.
  - **Round Robin**: Processos são executados em fatias de tempo iguais, alternadamente.
- Interface intuitiva para visualizar e interagir com as simulações.
- Totalmente responsivo e estilizado com TailwindCSS.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para criar interfaces de usuário.
- **Next.js**: Framework para desenvolvimento React com funcionalidades otimizadas de SSR e SSG.
- **TailwindCSS**: Framework CSS utilitário para estilização rápida e eficiente.

## Como Executar o Projeto

1. **Clone este repositório**:

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   ```

2. **Navegue até a pasta do projeto**:

   ```bash
   cd seu-repositorio
   ```

3. **Instale as dependências**:

   ```bash
   npm install
   # ou
   yarn install
   ```

4. **Inicie o servidor de desenvolvimento**:

   ```bash
   npm run dev
   # ou
   yarn dev
   ```

5. **Acesse o projeto** no navegador:

   [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```plaintext
src/
├── components/       # Componentes reutilizáveis
├── pages/            # Páginas do Next.js
├── styles/           # Estilos globais e configurações do TailwindCSS
├── utils/            # Funções utilitárias e lógica dos algoritmos
├── public/           # Arquivos estáticos
└── ...
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir **issues** ou enviar **pull requests** para melhorar este projeto.

1. Faça um fork do projeto.
2. Crie uma nova branch:

   ```bash
   git checkout -b feature/sua-feature
   ```

3. Faça suas alterações e commit:

   ```bash
   git commit -m "Descrição da sua feature"
   ```

4. Envie para o repositório remoto:

   ```bash
   git push origin feature/sua-feature
   ```

5. Abra um **Pull Request** no GitHub.

## Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE).