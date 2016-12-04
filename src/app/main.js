'use strict'

import $ from 'jquery'
import Clipboard from 'clipboard'

$(document).ready(function() {
	
	let App = function() {
		let init, setupEvents, convertSpaces, notify,
			$btnConvert = $('.btn-convert'),
			$btnInfo = $('.btn-info'),
			$btnEmail = $('.btn-email'),

			$popupInfo = $('.popup-info'),
			$popupClose = $('.popup-close'),

			$tabTrigger = $('.tab-trigger'),
			$tab = $('.tab'),

			$textArea = $('.textarea'),
			$textArea2 = $('.textarea2'),
			$alert = $('.alert'),
			// Sierotki array copied from Wordpress Plugin -> check this here https://pl.wordpress.org/plugins/sierotki/
			sierotki = ['al.', 'ale', 'ależ', 'b.', 'bm.', 'bp', 'br.', 'by', 'bym', 'byś', 'bł.', 'cyt.', 'cz.', 'czyt.', 'dn.', 'do', 'doc.', 'dr', 'ds.', 'dyr.', 'dz.', 'fot.', 'gdy', 'gdyby', 'gdybym', 'gdybyś', 'gdyż', 'godz.', 'im.', 'inż.', 'jw.', 'kol.', 'komu', 'ks.', 'która', 'którego', 'której', 'któremu', 'który', 'których', 'którym', 'którzy', 'lic.', 'm.in.', 'max', 'mgr', 'min', 'moich', 'moje', 'mojego', 'mojej', 'mojemu', 'mych', 'mój', 'na', 'nad', 'np.', 'nr', 'nr.', 'nrach', 'nrami', 'nrem', 'nrom', 'nrowi', 'nru', 'nry', 'nrze', 'nrze', 'nrów', 'nt.', 'nw.', 'od', 'oraz', 'os.', 'p.', 'pl.', 'pn.', 'po', 'pod', 'pot.', 'prof.', 'przed', 'pt.', 'pw.', 'pw.', 'tamtej', 'tamto', 'tej', 'tel.', 'tj.', 'to', 'twoich', 'twoje', 'twojego', 'twojej', 'twych', 'twój', 'ul.', 'we', 'wg', 'woj.', 'za', 'ze', 'śp.', 'św.', 'że', 'żeby', 'żebyś' ]

		setupEvents = function() {
			let keycode, clipboard

			clipboard = new Clipboard('.btn-copy');

			clipboard.on('success', function(e) {
				notify('success')
			});

			clipboard.on('error', function(e) {
				notify('error') 
			});

			$('textarea').on('focus', function(event) {
				event.preventDefault()
				$(this).select()
			});

			$btnConvert.on('click', function(event) {
				event.preventDefault()
				convertSpaces($textArea.val())
			});

			$btnInfo.on('click', function(event) {
				event.preventDefault()
				
				if ($popupInfo.hasClass('visible')) {
					$popupInfo.removeClass('visible')
					$btnInfo.addClass('visible')
				} else {
					$popupInfo.addClass('visible')
					$btnInfo.removeClass('visible')
				}
			});

			$tabTrigger.on('click', 'a', function(event) {
				event.preventDefault();
				
				$tabTrigger.find('a').removeClass('active')
				$(this).addClass('active')

				$tab.removeClass('visible')
				$('.tab[data-tab="'+$(this).data('show')+'"]').addClass('visible')
			});

			$popupClose.on('click', function(event) {
				event.preventDefault();
				$popupInfo.removeClass('visible')
				$btnInfo.addClass('visible')
			});

			$textArea.bind('paste', function() {
				let _this = $(this)

				setTimeout(function() {
					convertSpaces($textArea.val())
				}, 100)
			})
		}

		notify = function(msg) {
			let $alertMessage = $alert.find('p')

			$alert.removeClass('success, error')
			$alertMessage.html('')

			switch (msg) {
				case 'error':
					$alert.addClass('error')
					$alertMessage.html('Wystąpił błąd')

					setTimeout(function() {
						$('.alert').removeClass('error')
					}, 600)

					break
				default:
					$alert.addClass('success')
					$alertMessage.html('Skopiowano do schowka')

					setTimeout(function() {
						$('.alert').removeClass('success')
					}, 600)
			}
		}

		convertSpaces = function(text) {
			let convertedText = '',
				textAsArray,
				textAsArrayMax

			textAsArray = text.split(' ')
			textAsArrayMax = textAsArray.length - 1

			for (var i in textAsArray) {
				let found = false

				if (textAsArray[i].length <= 2) {
					found = true
				} else {
					for (var j in sierotki) {
						if (sierotki[j] == textAsArray[i]) {
							found = true
						}
					}
				}

				if (found == true && textAsArray[i] !== '') {
					convertedText += textAsArray[i] + '&nbsp;'
				} else {
					if (i == textAsArrayMax) {
						convertedText += textAsArray[i]
					} else {
						convertedText += textAsArray[i] + ' '
					}
				}
			}

			$textArea2.val(convertedText).select()

			return
		}



		init = function() {
			setupEvents()
		}

		return {
			init: init
		}
	}

	let app = new App()
	app.init()
})