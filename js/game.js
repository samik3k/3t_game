(function($) {
	$.fn.t3_game = function(options) {
		/* vars */
		var obj = this;
		var elements = obj.find('.js-game-obj');
		var current_player = obj.find('.js-current-player');
		var gameover_window = obj.find('.js-game-over');
		var gameover_activeClass = 'game-over-active';
		var restart_button = obj.find('.js-game-restart');
		var field_data = [
			['z', 'z', 'z'],
			['z', 'z', 'z'],
			['z', 'z', 'z']
		];
		var player_symbol = 'x';

		var defaultConfig = {};

		/* functions */
		this.init = function(options) {
			this.config = $.extend({}, defaultConfig, options);
			this.turn_number = 0;
			this.gameover = false;
			// this.randomizePlayers();
			this.findCurrentPlayerSymbol();
			this.setHandlers();
		};

		this.setHandlers = function() {
			var _that = this;
			elements.click(function() {
				_that.handleField($(this));
			});
			restart_button.click(function() {
				_that.resetGame();
			});
		};

		this.handleField = function(field) {
			if (this.checkField(field)) {
				field.text(player_symbol);
				var _row = field.attr('data-row') - 1;
				var _col = field.attr('data-col') - 1;
				field_data[_row][_col] = player_symbol;
				this.endTurn(field);
			}
		};

		this.findCurrentPlayer = function() {
			current_player = obj.find('.js-current-player');
		};

		this.findCurrentPlayerSymbol = function() {
			player_symbol = current_player.find('.js-player-symbol').text();
		};

		this.checkField = function(field) {
			if (field.text() != '') {
				return false;
			}
			return true;
		};

		this.setNextPlayer = function() {
			var nextPlayer = obj.find('.js-player:not(.js-current-player)');
			obj.find('.js-player').removeClass('js-current-player current-player');
			nextPlayer.addClass('js-current-player current-player');
			this.findCurrentPlayer();
			this.findCurrentPlayerSymbol();
		};

		this.checkWinner = function(field) {
			var data_size = 3;
			var winner_state = true;
			var _row = field.attr('data-row') - 1;
			var _col = field.attr('data-col') - 1;
			console.log('rows');
			for (var j = 0; j < data_size; j++) {
				console.log(field_data[_row][j]);
				if (field_data[_row][j] != player_symbol) {
					winner_state = false;
					break;
				}
			}
			if (!winner_state) {
				console.log('cols');
				for (var j = 0; j < data_size; j++) {
					console.log(field_data[j][_col]);
					if (field_data[j][_col] != player_symbol) {
						winner_state = false;
						break;
					}
					winner_state = true;
				}
			}
			if (!winner_state) {
				console.log('diagonal left to right');
				var left_top = true;
				if ((_col == 2 && _row == 0) || (_col == 0 && _row == 2)) {
					console.log('diagonal right to left');
					left_top = false;
				}
				var k = 0;
				if (!left_top) {
					k = data_size - 1;
				}
				for (var j = 0; j < data_size; j++) {
					console.log(field_data[j][k]);
					if (field_data[j][k] != player_symbol) {
						winner_state = false;
						break;
					}
					if (!left_top) {
						k--;
					} else {
						k++;
					}
					winner_state = true;
				}
			}
			if (winner_state) {
				this.setWinner();
			}
		};

		this.setWinner = function() {
			this.gameover = true;
			gameover_window.find('.js-game-winner').text(current_player.find('.js-player-name').text());
		};

		this.checkEndGame = function() {
			this.gameover = true;
			gameover_window.find('.js-game-winner').text('Ничья');
		};

		this.showGameOverWindow = function() {
			gameover_window.addClass(gameover_activeClass);
		};

		this.endTurn = function(field) {
			this.turn_number++;
			if (this.turn_number > 4) {
				this.checkWinner(field);
			}
			if (!this.gameover && this.turn_number == 9) {
				this.checkEndGame();
			}
			if (this.gameover) {
				this.showGameOverWindow();
				return false;
			}
			this.setNextPlayer();
		};

		this.resetGame = function() {
			if (!this.gameover) {
				return false;
			}
			elements.empty();
			field_data = [
				['z', 'z', 'z'],
				['z', 'z', 'z'],
				['z', 'z', 'z']
			];
			this.turn_number = 0;
			this.gameover = false;
			gameover_window.removeClass(gameover_activeClass);
		};

		/* init */
		this.init(options);
	};
})(jQuery);

$('.js-game').t3_game({});
