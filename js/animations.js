// Physics Animations using Three.js
document.addEventListener('DOMContentLoaded', function() {
    // Quantum Wave Function Animation
    function createQuantumWave() {
        const canvas = document.getElementById('quantum-wave');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        let time = 0;

        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);

            // Draw quantum wave function
            ctx.beginPath();
            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 2;

            for (let x = 0; x < width; x++) {
                const y = height/2 + 
                    50 * Math.sin(x/30 + time) * 
                    Math.exp(-Math.pow((x - width/2)/100, 2));
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.stroke();
            time += 0.05;
            requestAnimationFrame(animate);
        }

        animate();
    }

    // Particle System Animation
    function createParticleSystem() {
        const canvas = document.getElementById('particle-system');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const particles = [];
        const numParticles = 50;

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.radius = Math.random() * 3 + 1;
                this.life = 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.01;

                if (this.x < 0 || this.x > canvas.width ||
                    this.y < 0 || this.y > canvas.height ||
                    this.life <= 0) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(52, 152, 219, ${this.life})`;
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < numParticles; i++) {
            particles.push(new Particle());
        }

        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Draw connections between nearby particles
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(52, 152, 219, ${0.2 * (1 - distance/100)})`;
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(animate);
        }

        animate();
    }

    // Crystal Lattice Animation
    function createCrystalLattice() {
        const canvas = document.getElementById('crystal-lattice');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        let time = 0;

        const latticePoints = [];
        const spacing = 40;
        const amplitude = 5;

        // Create lattice points
        for (let x = spacing; x < width; x += spacing) {
            for (let y = spacing; y < height; y += spacing) {
                latticePoints.push({ x, y });
            }
        }

        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, width, height);

            // Draw lattice points and connections
            latticePoints.forEach((point, i) => {
                const offsetX = amplitude * Math.sin(time + point.x/50);
                const offsetY = amplitude * Math.cos(time + point.y/50);

                // Draw connections
                if (i < latticePoints.length - 1) {
                    ctx.beginPath();
                    ctx.moveTo(point.x + offsetX, point.y + offsetY);
                    ctx.lineTo(latticePoints[i+1].x + amplitude * Math.sin(time + latticePoints[i+1].x/50),
                             latticePoints[i+1].y + amplitude * Math.cos(time + latticePoints[i+1].y/50));
                    ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
                    ctx.stroke();
                }

                // Draw points
                ctx.beginPath();
                ctx.arc(point.x + offsetX, point.y + offsetY, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#3498db';
                ctx.fill();
            });

            time += 0.02;
            requestAnimationFrame(animate);
        }

        animate();
    }

    // Initialize all animations
    createQuantumWave();
    createParticleSystem();
    createCrystalLattice();
});
