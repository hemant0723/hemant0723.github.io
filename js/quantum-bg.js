// Quantum DFT Background Animation
class QuantumBackground {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.renderer.setClearColor(0x000000, 0.0);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('quantum-bg').appendChild(this.renderer.domElement);

        // Grid parameters
        this.gridSize = 50;
        this.spacing = 0.5;
        this.time = 0;
        this.waves = [];

        this.setupScene();
        this.animate();
        this.handleResize();
    }

    setupScene() {
        // Create grid of points
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = -this.gridSize; i <= this.gridSize; i++) {
            for (let j = -this.gridSize; j <= this.gridSize; j++) {
                positions.push(i * this.spacing, 0, j * this.spacing);
                colors.push(0.5, 0.5, 0.5); // Grayscale colors
            }
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);

        // Add wave sources
        for (let i = 0; i < 3; i++) {
            this.waves.push({
                x: (Math.random() - 0.5) * this.gridSize * this.spacing,
                z: (Math.random() - 0.5) * this.gridSize * this.spacing,
                frequency: 0.5 + Math.random() * 1.5,
                phase: Math.random() * Math.PI * 2
            });
        }

        // Position camera
        this.camera.position.set(15, 20, 15);
        this.camera.lookAt(0, 0, 0);
    }

    updatePoints() {
        const positions = this.points.geometry.attributes.position.array;
        const colors = this.points.geometry.attributes.color.array;

        for (let i = 0; i < positions.length; i += 3) {
            const x = positions[i];
            const z = positions[i + 2];
            let y = 0;

            // Quantum wave interference pattern
            for (const wave of this.waves) {
                const dx = x - wave.x;
                const dz = z - wave.z;
                const distance = Math.sqrt(dx * dx + dz * dz);
                y += Math.sin(distance * wave.frequency - this.time + wave.phase) * 
                     Math.exp(-distance * 0.1);
            }

            positions[i + 1] = y;

            // Update color based on wave height
            const intensity = (y + 1) * 0.5;
            colors[i] = intensity;
            colors[i + 1] = intensity;
            colors[i + 2] = intensity;
        }

        this.points.geometry.attributes.position.needsUpdate = true;
        this.points.geometry.attributes.color.needsUpdate = true;
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.time += 0.05;
        this.updatePoints();
        
        // Slowly rotate the scene
        this.points.rotation.y += 0.001;

        this.renderer.render(this.scene, this.camera);
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuantumBackground();
});
