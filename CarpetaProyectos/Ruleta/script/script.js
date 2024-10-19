var options = [];
        var startAngle = 0;
        var arc = Math.PI / (options.length / 2);
        var spinTimeout = null;
        var spinAngleStart = 10;
        var spinTime = 0;
        var spinTimeTotal = 0;
        var ctx;
        var centerImage = document.getElementById("centerImage");

        document.getElementById("addNumber").addEventListener("click", addNumber);
        document.getElementById("sequentialNumber").addEventListener("input", addSequence);
        document.getElementById("spin").addEventListener("click", spin);

        function addNumber() {
            const userNumber = document.getElementById("userNumber").value;
            if (userNumber < 1 || userNumber > 100) {
                alert("Por favor, ingresa un número entre 1 y 100.");
                return;
            }
            if (options.includes(userNumber)) {
                alert("Ese número ya está en la ruleta.");
                return;
            }
            options.push(userNumber);
            document.getElementById("userNumber").value = "";
            drawRouletteWheel();
        }

        function addSequence() {
            const seqNumber = document.getElementById("sequentialNumber").value;
            options = [];
            if (seqNumber < 1 || seqNumber > 500) {
                drawRouletteWheel();
                return;
            }
            for (let i = 1; i <= seqNumber; i++) {
                if (!options.includes(i.toString())) {
                    options.push(i.toString());
                }
            }
            drawRouletteWheel();
        }

        function getColor(item) {
            const colors = ['#007bff', '#28a745', '#17a2b8', '#ffc107', '#dc3545', '#6610f2', '#fd7e14', '#6f42c1'];
            return colors[item % colors.length];
        }

        function drawRouletteWheel() {
            var canvas = document.getElementById("canvas");
            if (canvas.getContext) {
                var outsideRadius = 150;
                var textRadius = 120;
                var insideRadius = 100;

                ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, 350, 350);

                ctx.lineWidth = 2;

                ctx.font = 'bold 12px Montserrat';

                arc = Math.PI / (options.length / 2);

                for (var i = 0; i < options.length; i++) {
                    var angle = startAngle + i * arc;
                    ctx.fillStyle = getColor(i);

                    ctx.beginPath();
                    ctx.arc(175, 175, outsideRadius, angle, angle + arc, false);
                    ctx.arc(175, 175, insideRadius, angle + arc, angle, true);
                    ctx.fill();

                    ctx.save();
                    ctx.fillStyle = "black";
                    ctx.translate(175 + Math.cos(angle + arc / 2) * textRadius,
                                  175 + Math.sin(angle + arc / 2) * textRadius);
                    ctx.rotate(angle + arc / 2 + Math.PI / 2);
                    var text = options[i];
                    ctx.fillText(text, -ctx.measureText(text).width / 2, 0);
                    ctx.restore();
                }

                // Arrow
                ctx.fillStyle = "#28a745";
                ctx.beginPath();
                ctx.moveTo(175 - 4, 175 - (outsideRadius + 5));
                ctx.lineTo(175 + 4, 175 - (outsideRadius + 5));
                ctx.lineTo(175 + 4, 175 - (outsideRadius - 5));
                ctx.lineTo(175 + 9, 175 - (outsideRadius - 5));
                ctx.lineTo(175 + 0, 175 - (outsideRadius - 13));
                ctx.lineTo(175 - 9, 175 - (outsideRadius - 5));
                ctx.lineTo(175 - 4, 175 - (outsideRadius - 5));
                ctx.lineTo(175 - 4, 175 - (outsideRadius + 5));
                ctx.fill();
            }
        }

        function spin() {
            if (options.length === 0) {
                alert("Por favor, agrega números a la ruleta.");
                return;
            }
            centerImage.style.display = "block"; // Mostrar la imagen
            spinAngleStart = Math.random() * 10 + 10;
            spinTime = 0;
            spinTimeTotal = Math.random() * 3 + 4 * 1000;
            rotateWheel();
        }

        function rotateWheel() {
            spinTime += 30;
            if (spinTime >= spinTimeTotal) {
                stopRotateWheel();
                return;
            }

            var spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
            startAngle += (spinAngle * Math.PI / 180);
            drawRouletteWheel();

            // Cambiar color del borde y hacer parpadear
            const borderColors = ['#28a745', '#ff5733', '#f1c40f', '#3498db', '#9b59b6'];
            ctx.strokeStyle = borderColors[Math.floor(Math.random() * borderColors.length)];
            ctx.lineWidth = 5; // Hacer el borde más grueso
            ctx.stroke();

            spinTimeout = setTimeout(rotateWheel, 30);
        }

        function stopRotateWheel() {
            clearTimeout(spinTimeout);
            var degrees = startAngle * 180 / Math.PI + 90;
            var arcd = arc * 180 / Math.PI;
            var index = Math.floor((360 - degrees % 360) / arcd);
            ctx.save();
            ctx.font = 'bold 30px Montserrat';
            var text = options[index];
            document.getElementById("result").textContent = "¡Has ganado: " + text + "!";
            $('#resultModal').modal('show');

            // Cambia la imagen al ganar
            centerImage.src = 'img/win.gif'; // Cambia a la imagen del ganador
            centerImage.style.display = "block"; // Mostrar la imagen
            centerImage.style.width = "350px";
            centerImage.style.height = "350px";

            // Activar el cierre del modal después de 5 segundos
            setTimeout(() => {
                centerImage.src="img/topo.gif";
                centerImage.style.width="50px";
                centerImage.style.height="auto";
                centerImage.style.display= "none";
                document.getElementById("closeButton").disabled = false; // Habilitar botón de cierre
                document.getElementById("modalCloseButton").disabled = false; // Habilitar botón de cerrar
            }, 5000);

            ctx.fillText(text, 175 - ctx.measureText(text).width / 2, 175 + 10);
            ctx.restore();
            document.getElementById("closeButton").disabled = true; // Habilitar botón de cierre
            document.getElementById("modalCloseButton").disabled = true; // Habilitar botón de cerrar
        }

        function easeOut(t, b, c, d) {
            var ts = (t /= d) * t;
            var tc = ts * t;
            return b + c * (tc + -3 * ts + 3 * t);
        }

        drawRouletteWheel();