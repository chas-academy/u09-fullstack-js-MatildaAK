
const ProductDescription = (props: { product: any; }) => {

    const {product} = props;

    return (
        <div className="px-8 py-16">
            <div className="border-2 border-y-black dark:border-y-white ">
                <p className='text-black dark:text-white py-3'>
                    {product.description}
                </p>
            </div>
        </div>
    )
}

export default ProductDescription
