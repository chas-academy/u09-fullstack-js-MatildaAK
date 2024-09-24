import POPULAR from '../../assets/popular'
import Item from './Item'

const Popular = () => {
    return (
        <section>
            <div>
                <h3>Populära Böcker</h3>
                <hr />
                {/* container */}
                <div className='grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 xl:grid-cols-5'>
                    {POPULAR.map((item) => {
                        return (
                            <Item
                                key={item.id}
                                id={item.id}
                                image={item.image}
                                title={item.title}
                                author={item.author}
                                price={item.price} 
                                category={''}                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

export default Popular
