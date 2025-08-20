// Advanced JavaScript for Birthday Website

class BirthdayWebsite {
  constructor() {
    this.confettiCanvas = document.getElementById("confetti-canvas")
    this.ctx = this.confettiCanvas.getContext("2d")
    this.confettiParticles = []
    this.animationId = null

    this.init()
  }

  init() {
    this.setupCanvas()
    this.setupEventListeners()
    this.startAnimations()
    this.loadWishes()
    this.setupIntersectionObserver()
    this.typewriterEffect()
    this.setupMusic()
  }

  setupCanvas() {
    this.resizeCanvas()
    window.addEventListener("resize", () => this.resizeCanvas())
  }

  resizeCanvas() {
    this.confettiCanvas.width = window.innerWidth
    this.confettiCanvas.height = window.innerHeight
  }

  setupEventListeners() {
    // Surprise button
    document.getElementById("surprise-btn").addEventListener("click", () => {
      this.showBirthdayModal()
      this.createConfettiBurst()
    })

    // Modal controls
    const modal = document.getElementById("birthday-modal")
    const closeBtn = document.querySelector(".close")
    const blowBtn = document.getElementById("blow-candle")

    closeBtn.addEventListener("click", () => this.closeBirthdayModal())
    blowBtn.addEventListener("click", () => this.blowCandle())

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        this.closeBirthdayModal()
      }
    })

    // Wish form
    document.getElementById("wish-form").addEventListener("submit", (e) => {
      e.preventDefault()
      this.submitWish()
    })

    // Smooth scrolling for navigation
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetSection = document.querySelector(targetId)
        targetSection.scrollIntoView({ behavior: "smooth" })
      })
    })

    // Balloon click effects
    document.querySelectorAll(".balloon").forEach((balloon) => {
      balloon.addEventListener("click", () => {
        this.popBalloon(balloon)
      })
    })
  }

  setupMusic() {
    const musicBtn = document.getElementById("music-toggle")
    const music = document.getElementById("background-music")
    let isPlaying = false

    musicBtn.addEventListener("click", () => {
      if (isPlaying) {
        music.pause()
        musicBtn.textContent = "🎵"
        musicBtn.style.background = "var(--primary-pink)"
      } else {
        music.play().catch((e) => console.log("Audio play failed:", e))
        musicBtn.textContent = "🔇"
        musicBtn.style.background = "var(--primary-green)"
      }
      isPlaying = !isPlaying
    })
  }

  typewriterEffect() {
    const textElement = document.querySelector(".typing-text")
    const text = textElement.getAttribute("data-text")
    let index = 0

    textElement.textContent = ""

    const typeInterval = setInterval(() => {
      if (index < text.length) {
        textElement.textContent += text.charAt(index)
        index++
      } else {
        clearInterval(typeInterval)
        textElement.style.borderRight = "none"
      }
    }, 100)
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeInUp 0.8s ease forwards"

          // Animate stats counters
          if (entry.target.classList.contains("about")) {
            this.animateCounters()
          }
        }
      })
    }, observerOptions)

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section)
    })
  }

  animateCounters() {
    const counters = document.querySelectorAll(".stat-number")

    counters.forEach((counter) => {
      const target = counter.getAttribute("data-target")
      const isInfinity = target === "∞"

      if (isInfinity) {
        counter.textContent = "∞"
        return
      }

      const targetNum = Number.parseInt(target)
      const increment = targetNum / 100
      let current = 0

      const updateCounter = () => {
        if (current < targetNum) {
          current += increment
          counter.textContent = Math.ceil(current)
          requestAnimationFrame(updateCounter)
        } else {
          counter.textContent = targetNum
        }
      }

      updateCounter()
    })
  }

  createConfettiBurst() {
    const colors = ["#ff6b9d", "#a855f7", "#3b82f6", "#fbbf24", "#10b981"]

    for (let i = 0; i < 150; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.confettiCanvas.width,
        y: Math.random() * this.confettiCanvas.height,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 2,
        life: 1,
        decay: Math.random() * 0.02 + 0.01,
      })
    }

    if (!this.animationId) {
      this.animateConfetti()
    }
  }

  animateConfetti() {
    this.ctx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height)

    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const particle = this.confettiParticles[i]

      particle.x += particle.vx
      particle.y += particle.vy
      particle.vy += 0.3 // gravity
      particle.life -= particle.decay

      this.ctx.save()
      this.ctx.globalAlpha = particle.life
      this.ctx.fillStyle = particle.color
      this.ctx.fillRect(particle.x, particle.y, particle.size, particle.size)
      this.ctx.restore()

      if (particle.life <= 0 || particle.y > this.confettiCanvas.height) {
        this.confettiParticles.splice(i, 1)
      }
    }

    if (this.confettiParticles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animateConfetti())
    } else {
      this.animationId = null
    }
  }

  showBirthdayModal() {
    const modal = document.getElementById("birthday-modal")
    modal.style.display = "block"
    document.body.style.overflow = "hidden"
  }

  closeBirthdayModal() {
    const modal = document.getElementById("birthday-modal")
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }

  blowCandle() {
    const flame = document.querySelector(".flame")
    const cake = document.querySelector(".cake")

    // Blow out animation
    flame.style.animation = "none"
    flame.style.opacity = "0"
    flame.style.transform = "translateX(-50%) scale(0)"

    // Cake celebration
    cake.style.animation = "pulse 0.5s ease"

    // Create fireworks
    setTimeout(() => {
      this.createFireworks()
      this.closeBirthdayModal()
    }, 1000)
  }

  createFireworks() {
    const container = document.getElementById("fireworks-container")
    const colors = ["#ff6b9d", "#a855f7", "#3b82f6", "#fbbf24", "#10b981"]

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const firework = document.createElement("div")
        firework.className = "firework"
        firework.style.left = Math.random() * 100 + "%"
        firework.style.top = Math.random() * 50 + 20 + "%"
        firework.style.background = colors[Math.floor(Math.random() * colors.length)]

        container.appendChild(firework)

        // Create explosion particles
        for (let j = 0; j < 12; j++) {
          const particle = document.createElement("div")
          particle.className = "firework"
          particle.style.left = firework.style.left
          particle.style.top = firework.style.top
          particle.style.background = colors[Math.floor(Math.random() * colors.length)]

          const angle = (j / 12) * Math.PI * 2
          const distance = 100
          const x = Math.cos(angle) * distance
          const y = Math.sin(angle) * distance

          particle.style.transform = `translate(${x}px, ${y}px)`
          container.appendChild(particle)

          setTimeout(() => particle.remove(), 1000)
        }

        setTimeout(() => firework.remove(), 1000)
      }, i * 300)
    }

    // Clear container after animation
    setTimeout(() => {
      container.innerHTML = ""
    }, 3000)
  }

  popBalloon(balloon) {
    balloon.style.animation = "none"
    balloon.style.transform = "scale(0)"
    balloon.style.opacity = "0"

    // Create pop effect
    const pop = document.createElement("div")
    pop.textContent = "💥"
    pop.style.position = "absolute"
    pop.style.left = balloon.style.left
    pop.style.top = "50%"
    pop.style.fontSize = "2rem"
    pop.style.animation = "fadeInUp 0.5s ease forwards"
    pop.style.pointerEvents = "none"

    document.querySelector(".balloons-container").appendChild(pop)

    setTimeout(() => {
      pop.remove()
      balloon.style.transform = "scale(1)"
      balloon.style.opacity = "1"
      balloon.style.animation = "float 6s ease-in-out infinite"
    }, 2000)
  }

  submitWish() {
    const nameInput = document.getElementById("wish-name")
    const messageInput = document.getElementById("wish-message")
    const name = nameInput.value.trim()
    const message = messageInput.value.trim()

    if (name && message) {
      const wish = {
        id: Date.now(),
        name: name,
        message: message,
        timestamp: new Date().toISOString(),
      }

      this.saveWish(wish)
      this.displayWish(wish)

      // Clear form
      nameInput.value = ""
      messageInput.value = ""

      // Show success animation
      this.showWishSuccess()
    }
  }

  saveWish(wish) {
    const wishes = JSON.parse(localStorage.getItem("birthdayWishes")) || []
    wishes.unshift(wish)
    localStorage.setItem("birthdayWishes", JSON.stringify(wishes))
  }

  loadWishes() {
    const wishes = JSON.parse(localStorage.getItem("birthdayWishes")) || []
    wishes.forEach((wish) => this.displayWish(wish))
  }

  displayWish(wish) {
    const wishesDisplay = document.getElementById("wishes-display")
    const wishElement = document.createElement("div")
    wishElement.className = "wish-item"
    wishElement.innerHTML = `
            <div class="wish-author">💌 ${wish.name}</div>
            <div class="wish-text">${wish.message}</div>
        `

    wishesDisplay.insertBefore(wishElement, wishesDisplay.firstChild)
  }

  showWishSuccess() {
    const button = document.querySelector(".wish-form button")
    const originalText = button.textContent

    button.textContent = "✨ Wish Sent! ✨"
    button.style.background = "var(--primary-green)"

    setTimeout(() => {
      button.textContent = originalText
      button.style.background = "linear-gradient(135deg, var(--primary-pink), var(--primary-purple))"
    }, 2000)
  }

  startAnimations() {
    // Add sparkle effects periodically
    setInterval(() => {
      this.createSparkle()
    }, 3000)

    // Continuous confetti (light)
    setInterval(() => {
      if (Math.random() < 0.3) {
        this.createLightConfetti()
      }
    }, 2000)
  }

  createSparkle() {
    const sparkle = document.createElement("div")
    sparkle.textContent = "✨"
    sparkle.style.position = "fixed"
    sparkle.style.left = Math.random() * 100 + "%"
    sparkle.style.top = Math.random() * 100 + "%"
    sparkle.style.fontSize = "1.5rem"
    sparkle.style.pointerEvents = "none"
    sparkle.style.zIndex = "999"
    sparkle.style.animation = "sparkle 2s ease-in-out forwards"

    document.body.appendChild(sparkle)

    setTimeout(() => sparkle.remove(), 2000)
  }

  createLightConfetti() {
    const colors = ["#ff6b9d", "#a855f7", "#3b82f6", "#fbbf24", "#10b981"]

    for (let i = 0; i < 10; i++) {
      this.confettiParticles.push({
        x: Math.random() * this.confettiCanvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 1,
        life: 1,
        decay: 0.005,
      })
    }

    if (!this.animationId) {
      this.animateConfetti()
    }
  }
}

// Initialize the birthday website when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new BirthdayWebsite()
})

// Add some extra interactive features
document.addEventListener("DOMContentLoaded", () => {
  // Add hover effects to gallery items
  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateY(-10px) scale(1.02)"
    })

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateY(0) scale(1)"
    })
  })

  // Add click effects to section titles
  document.querySelectorAll(".section-title").forEach((title) => {
    title.addEventListener("click", () => {
      title.style.animation = "none"
      setTimeout(() => {
        title.style.animation = "pulse 0.6s ease"
      }, 10)
    })
  })

  // Parallax effect for hero section
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const hero = document.querySelector(".hero")
    const rate = scrolled * -0.5

    if (hero) {
      hero.style.transform = `translateY(${rate}px)`
    }
  })
})
