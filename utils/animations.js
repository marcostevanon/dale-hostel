export const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export const staggerChildren = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export const hoverScale = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
}

export const cardHover = {
  whileHover: { y: -5 },
  transition: { duration: 0.2 },
}
