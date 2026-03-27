import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Hot Carrier Animation with Phonon Effects
var HotCarrierAnimation = (function() {
    function HotCarrierAnimation() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ 
            alpha: true, 
            antialias: true,
            preserveDrawingBuffer: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        document.getElementById('hot-carriers').appendChild(this.renderer.domElement);

        this.carriers = [];
        this.phonons = [];
        this.bandGapY = 0;
        this.maxEnergy = 5;

        this.setupScene();
        this.createPhonons(50);
        this.createHotCarriers(30);
        this.setupPostProcessing();
        this.animate();
        this.handleResize();
    }

    HotCarrierAnimation.prototype.setupPostProcessing = function() {
        if (!this.renderer) return;
        this.composer = new EffectComposer(this.renderer);
        var renderPass = new RenderPass(this.scene, this.camera);
        var bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5,    // Bloom intensity
            0.3,    // Bloom radius
            0.7     // Bloom threshold
        );
        this.composer.addPass(renderPass);
        this.composer.addPass(bloomPass);
    }

    HotCarrierAnimation.prototype.setupScene = function() {
        if (!this.scene || !this.camera) return;
        // Camera position
        this.camera.position.z = 800;

        // Create band structure (valence and conduction bands)
        const bandMaterial = new THREE.LineBasicMaterial({ color: 0x666666 });
        
        // Valence band
        const valenceGeometry = new THREE.BufferGeometry();
        const valencePoints = [];
        for (let x = -10; x <= 10; x += 0.1) {
            valencePoints.push(x, -2 + Math.sin(x * 0.5) * 0.3, 0);
        }
        valenceGeometry.setAttribute('position', new THREE.Float32BufferAttribute(valencePoints, 3));
        const valenceBand = new THREE.Line(valenceGeometry, bandMaterial);
        this.scene.add(valenceBand);

        // Conduction band
        const conductionGeometry = new THREE.BufferGeometry();
        const conductionPoints = [];
        for (let x = -10; x <= 10; x += 0.1) {
            conductionPoints.push(x, 2 + Math.sin(x * 0.5) * 0.3, 0);
        }
        conductionGeometry.setAttribute('position', new THREE.Float32BufferAttribute(conductionPoints, 3));
        const conductionBand = new THREE.Line(conductionGeometry, bandMaterial);
        this.scene.add(conductionBand);
    }

    HotCarrierAnimation.prototype.createHotCarriers = function(count) {
        var geometry = new THREE.SphereGeometry(4, 32, 32);
        
        for (let i = 0; i < count; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(1, 0.5, 0.2),
                transparent: true,
                opacity: 0.9
            });
            
            const carrier = new THREE.Mesh(geometry, material);
            
            carrier.position.x = (Math.random() - 0.5) * 20;
            carrier.position.y = -2 + Math.sin(carrier.position.x * 0.5) * 0.3;
            carrier.position.z = (Math.random() - 0.5) * 2;
            
            carrier.velocity = {
                x: (Math.random() - 0.5) * 1.5,
                y: (Math.random() - 0.5) * 1.5,
                z: (Math.random() - 0.5) * 0.5
            };
            
            carrier.energy = 0;
            carrier.excited = false;
            carrier.relaxationTime = Math.random() * 100 + 50;
            carrier.lifetime = 0;
            
            // Add glow sprite
            const glowTexture = this.createGlowTexture();
            const spriteMaterial = new THREE.SpriteMaterial({
                map: glowTexture,
                color: 0xff5500,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
            const sprite = new THREE.Sprite(spriteMaterial);
            sprite.scale.set(1.5, 1.5, 1.5);
            carrier.add(sprite);
            
            this.carriers.push(carrier);
            this.scene.add(carrier);
        }
    }

    HotCarrierAnimation.prototype.createPhonons = function(count) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        
        for (let i = 0; i < count; i++) {
            const material = new THREE.MeshBasicMaterial({
                color: new THREE.Color(1, 0.3, 0.1),
                transparent: true,
                opacity: 0.8
            });
            
            const carrier = new THREE.Mesh(geometry, material);
            
            // Random initial position in valence band
            carrier.position.x = (Math.random() - 0.5) * 20;
            carrier.position.y = -2 + Math.sin(carrier.position.x * 0.5) * 0.3;
            carrier.position.z = (Math.random() - 0.5) * 2;
            
            carrier.velocity = {
                x: (Math.random() - 0.5) * 0.1,
                y: 0,
                z: (Math.random() - 0.5) * 0.1
            };
            
            carrier.energy = 0;
            carrier.excited = false;
            carrier.relaxationTime = Math.random() * 100 + 50;
            carrier.lifetime = 0;
            
            this.carriers.push(carrier);
            this.scene.add(carrier);
        }
    }

    HotCarrierAnimation.prototype.updateCarriers = function() {
        for (const carrier of this.carriers) {
            // Random excitation
            if (!carrier.excited && Math.random() < 0.01) {
                carrier.excited = true;
                carrier.energy = this.maxEnergy;
                carrier.velocity.y = 0.2;
                carrier.material.color.setRGB(1, 0.1, 0);
            }

            // Update position and energy
            if (carrier.excited) {
                carrier.lifetime++;
                
                // Energy relaxation
                if (carrier.lifetime > carrier.relaxationTime) {
                    carrier.energy *= 0.98;
                    carrier.velocity.y *= 0.98;
                    
                    // Update color based on energy
                    const energyRatio = carrier.energy / this.maxEnergy;
                    carrier.material.color.setRGB(
                        0.5 + energyRatio * 0.5,
                        0.3 * energyRatio,
                        0.1 * energyRatio
                    );
                }

                // Reset if fully relaxed
                if (carrier.energy < 0.1) {
                    this.resetCarrier(carrier);
                }
            }

            // Update position
            carrier.position.x += carrier.velocity.x;
            carrier.position.y += carrier.velocity.y;
            carrier.position.z += carrier.velocity.z;

            // Boundary check
            if (Math.abs(carrier.position.x) > 10) {
                carrier.velocity.x *= -1;
            }
            if (Math.abs(carrier.position.z) > 2) {
                carrier.velocity.z *= -1;
            }
        }
    }

    HotCarrierAnimation.prototype.resetCarrier = function(carrier) {
        carrier.position.x = (Math.random() - 0.5) * 20;
        carrier.position.y = -2 + Math.sin(carrier.position.x * 0.5) * 0.3;
        carrier.position.z = (Math.random() - 0.5) * 2;
        carrier.velocity.x = (Math.random() - 0.5) * 0.1;
        carrier.velocity.y = 0;
        carrier.velocity.z = (Math.random() - 0.5) * 0.1;
        carrier.excited = false;
        carrier.energy = 0;
        carrier.lifetime = 0;
        carrier.material.color.setRGB(1, 0.3, 0.1);
    }

    HotCarrierAnimation.prototype.createGlowTexture = function() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(32, 32, 32, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 85, 0, 0.5)';
        ctx.fill();
        return new THREE.CanvasTexture(canvas);
    }

    HotCarrierAnimation.prototype.updatePhonons = function() {
        // TO DO: implement phonon update logic
    }

    HotCarrierAnimation.prototype.animate = function() {
        if (!this.scene || !this.composer) return;
        var self = this;
        requestAnimationFrame(function() {
            self.animate();
        });
        this.updateCarriers();
        this.updatePhonons();
        this.composer.render();
    }

    HotCarrierAnimation.prototype.handleResize = function() {
        var self = this;
        window.addEventListener('resize', function() {
            self.camera.aspect = window.innerWidth / window.innerHeight;
            self.camera.updateProjectionMatrix();
            self.renderer.setSize(window.innerWidth, window.innerHeight);
            self.composer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    return HotCarrierAnimation;
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new HotCarrierAnimation();
});
