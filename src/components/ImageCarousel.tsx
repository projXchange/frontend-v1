
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';

interface CarouselImage {
    src: string;
    alt: string;
    title?: string;
    description?: string;
}

interface ImageCarouselProps {
    images: CarouselImage[];
    autoPlayInterval?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
    images,
    autoPlayInterval = 5000
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, autoPlayInterval);

        return () => clearInterval(timer);
    }, [currentIndex, autoPlayInterval]);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => {
            let nextIndex = prevIndex + newDirection;
            if (nextIndex < 0) nextIndex = images.length - 1;
            if (nextIndex >= images.length) nextIndex = 0;
            return nextIndex;
        });
    };

    const nextSlide = () => paginate(1);
    const prevSlide = () => paginate(-1);
    const goToSlide = (index: number) => {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
    };

    if (!images || images.length === 0) return null;

    return (
        <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] bg-gray-100 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl group">
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            nextSlide();
                        } else if (swipe > swipeConfidenceThreshold) {
                            prevSlide();
                        }
                    }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img
                        src={images[currentIndex].src}
                        alt={images[currentIndex].alt}
                        className="w-full h-full object-cover object-top"
                    />
                    {/* Text Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="max-w-3xl"
                        >
                            {(images[currentIndex].title || images[currentIndex].description) && (
                                <div className="backdrop-blur-sm bg-black/30 p-4 rounded-xl border border-white/10">
                                    {images[currentIndex].title && (
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                                            {images[currentIndex].title}
                                        </h3>
                                    )}
                                    {images[currentIndex].description && (
                                        <p className="text-sm sm:text-base md:text-lg text-gray-200 line-clamp-2">
                                            {images[currentIndex].description}
                                        </p>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 text-white"
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                aria-label="Previous slide"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md transition-all duration-200 opacity-0 group-hover:opacity-100 text-white"
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                aria-label="Next slide"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); goToSlide(index); }}
                        className={`transition-all duration-300 ${index === currentIndex
                            ? "text-white scale-110"
                            : "text-white/50 hover:text-white/80"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <Circle className={`w-2 h-2 sm:w-3 sm:h-3 ${index === currentIndex ? "fill-current" : ""}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};
