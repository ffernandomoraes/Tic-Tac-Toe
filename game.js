const Game = {
   el: document.getElementById('game'),
   gameDesign: new Array(9).fill(''),

   chars: {
      1: 'X',
      2: 'O'
   },

   round: 0,
   endGame: false,

   winCondition: [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],

      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],

      [0, 4, 8],
      [2, 4, 6],
   ],

   async start() {
      const elStarted = document.getElementById('playerStarted');
      const firstPlayer = await this.sortPlayerFirst();

      elStarted.innerHTML = `O player ${firstPlayer} começa jogando!`;

      this.gameDesign.map((_, i) => {
         let div = document.createElement('div');

         div.setAttribute('class', 'block');
         div.addEventListener('click', () => this.playerPlayed(i));

         this.el.appendChild(div);
      });
   },

   sortPlayerFirst() {
      const random = Math.floor(Math.random() * 2);
      const player = random % 2 === 0 ? this.chars[1] : this.chars[2];

      this.round = random;

      return new Promise(resolve => resolve(player));
   },

   checkGameOver() {
      const emptyBlocks = this.gameDesign.filter(b => b === '');

      return new Promise(resolve => {
         if (!emptyBlocks.length && !this.checkHasWinner()) {
            console.log('Acabou o jogo, houve um empate.');
            resolve(false);
         }
   
         resolve(true);
      });
   },

   checkHasWinner() {
      const hasWinner = this.winCondition.filter(p => {
         return (
            this.gameDesign[p[0]] != '' &&
            this.gameDesign[p[0]] === this.gameDesign[p[1]] &&
            this.gameDesign[p[0]] === this.gameDesign[p[2]]
         );
      });

      return new Promise(resolve => {
         if (hasWinner.length) {
            const player = this.round % 2 === 0 ? this.chars[1] : this.chars[2];
   
            console.log(`Acabou o jogo, o player ${player} venceu.`);
            this.endGame = true;
   
            resolve(true);
         }
   
         resolve(false);
      });
   },

   async playerPlayed(i) {
      if (!this.gameDesign[i] && !this.endGame) {
         const player = this.round % 2 === 0 ? this.chars[1] : this.chars[2];
         this.gameDesign[i] = player;

         await this.checkHasWinner();
         this.drawGameAfterPlayed();

         await this.checkGameOver();

         this.round++;
      }
   },

   drawGameAfterPlayed() {
      this.el.innerHTML = '';

      this.gameDesign.map((b, i) => {
         let div = document.createElement('div');
         div.addEventListener('click', () => this.playerPlayed(i));

         if (b) {
            const content = document.createTextNode(b);

            div.setAttribute('class', 'block --selected');
            div.appendChild(content);
         } else {
            div.setAttribute('class', 'block');
         }

         this.el.appendChild(div);
      });
   }
};

Game.start();
