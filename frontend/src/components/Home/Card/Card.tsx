import React from 'react'

interface CardProps {
    title: string
    backgroundImage?: string
    backgroundSize?: 'cover' | 'contain'
    backgroundPosition?: 'center' | 'top' | 'bottom'
    children: React.ReactNode
    footer?: React.ReactNode
}

const Card: React.FC<CardProps> = ({
    title = '',
    backgroundImage,
    backgroundSize = 'cover',
    backgroundPosition = 'center',
    children,
    footer,
}) => {
    return (
        <div className="flex justify-center">
            <div
                className="w-full md:w-4/5 xl:w-3/5 h-full bg-cover bg-no-repeat bg-center my-10"
                style={{
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: backgroundSize,
                    backgroundPosition: backgroundPosition,
                }}
            >
                <div className="px-8 pt-8 pb-6">
                    <div className="font-sans bg-primaryLightGreen dark:bg-primaryDarkGreen/50 backdrop-contrast-50 text-black dark:text-white rounded-lg max-w-lg mx-auto text-center">
                        <h2 className="text-2xl p-3">{title}</h2>
                        <p className="text-sm px-6 pt-4 pb-10 font-light">{children}</p>
                    </div>
                    <div className="pt-8 text-center">{footer}</div>
                </div>
            </div>
        </div>
    )
}

export default Card
