# Backend Documentation

1. [DB setup](#db-setup)
2. [Middleware](#middleware)

### DB setup

First I setup the MongoDB collection and connections. Then I move on to VSC where I setup the .env setup the Db.ts file.

---

#### Mongo db

First I went ahead to [MongoDB Atlas](https://account.mongodb.com/account/register?fromURI=https%3A%2F%2Fwww.mongodb.com%2Fdeveloper%2Fauth%2Fsignin%2F%3FfromPagePath%3D%2Fproducts%2Fatlas%2F) and created an accout. Filled in the required fields and got to the dashboard.

Next I created a Cluster and gave it the name we whised to have **mjs**. Next I clicked on the connect button and choose **Compass** from the list. Installed Compass in our Device and copied the connection string.

Went to MongoDB Compass and pasted the connection string along side our Cluster password that was provided while creating the cluster.

---

#### .env and db

1. The .env contains sensetive informations such as the MongoDB connection strings, the JWT secret key that was generated and Stripe secret key.

- We can generate the JWT secret key by runing the following code in the terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

- The JWT is to be kept secrue and if compromised is to be changed. If changed all users verfied with old JWT will be logedout and would require to login again.

---

2. Database connection (`Db.ts`):

In this file I iniciate the connection to MongoDB.

- I import dotenv from dotenv and then load the environment variables from the .env file by the follwing code in our db.ts file:

```
 dotenv.config();
```

- I made a function to establish the connection to the db:

```
const connectMJsDB = async () => {
  try {
    const mongoURI: string = process.env.MONGODB_URL || "";
    await connect(mongoURI);
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
```

- The function operates by first retrieving the connection string from the .env file using the process.env.MONGODB_URL variable. Then, the connect function from the Mongoose module attempts to establish a connection to the database. If the connection is successful, a message appears in the console; if unsuccessful, an error message with the failure status is displayed.

- Finally, the export it as the default export of the module is used to export the function:

```
export default connectMJsDB();
```

- That will allow me to import the module and the function that is connectMJsDB will be called and connection established to DB.

---

### Middleware

In this middleware I use a rolebased authoraziton and user authentication, multer to upload images and Stripe for payment.

***Auth:***

- I export interface CustomRequest interface which extends the Request interface which is built-in Express interface. I add the user and token properties to let us access them from the request object.


```
export interface CustomRequest extends Request {
  user?: IUser;
  token?: string;
}
```

- The decoded token with the \_id field that is a string is from the user in the database that helps me so I can use it to find the user in the database.

```
interface DecodedToken {
  _id: string;
}
```

- Now I have the auth function where I export the auth function. It is an asynchronous function that takes req, res, and next as arguments.The req is the request object, res is the response object, and next is a callback function that calls the next middleware function. I use the customRequest interface from above to define the req object because I want to add the user and token properties to it. And in the res object I use the Response interface from express to define the res object. As for the next function assigned to the next parameter, it is an express function used for callback to call the next middleware function.

```
export const auth = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Autentiseringen misslyckades. Vänligen logga in.");
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    if (!user) {
      throw new Error("Autentiseringen misslyckades. Användaren hittades inte.");
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: "Autentiseringen misslyckades." });
  }
};
```

- In the auth function, I first try to get the token from the Authorization header of the request. If no token is found, an error is thrown. Then, I verify the token using the jwt.verify method. The decoded token is expected to have an \_id property, which is the ID of the user in the database. I then try to find the user in the database using the \_id from the decoded token and the token itself. If no user is found, an error is thrown. If the user is found and the token is valid, I attach the user and the token to the request object and call the next middleware function. If any error occurs during this process, I catch the error and send a response with a status of 401 and a message of "Authentication failed.

```
export const admin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    await auth(req, res, async () => {
      if (req.user && req.user.role === 2) {
        next();
      } else {
        res.status(403).send({ error: "Åtkomst nekad. Användaren är inte en administratör." });
      }
    });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).send({ error: "Autentiseringen misslyckades." });
  }
};
```

- The admin function is another middleware function that checks if the authenticated user is an admin. It first calls the auth function to authenticate the user. If the user is authenticated and their role is 2 (indicating an admin user), the next middleware function is called. If the user is not an admin, a response with a status of 403 and a message of "Access denied. User is not an admin." is sent.

---

***Multer:***

- I am using multer for uploading images to my db and right now I save them with a path in my backend. I can upload one image per product / user.
The *diskStorage* configures how and where the files are stored on disk, and when they are uploaded. The *limits: { fileSize: 5 * 1024 * 1024 }* sets a file size limit of 5 MB. Multer will reject files larger than this limit. With the Date.now() it provides a current timestamp and ensuring each file has a unique prefix. 

```
const storage = multer.diskStorage({
  destination: function (
    req: any,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    const uploadPath = path.join(__dirname, "uploads");
    cb(null, uploadPath);
  },
  filename: function (
    req: any,
    file: { originalname: string },
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadMiddleware = upload.single("image");
```

---

***Stripe***

- I’m using Stripe to enable secure payments without storing sensitive information in my database. To manage environment variables, I’m using dotenv to load these from my .env file. I also validate that a secret key is present and throw an error if it is missing.

```
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET;

if (!stripeSecretKey) {
  throw new Error("Stripe secret key is not defined in the environment variables");
}

export const stripe = new Stripe(stripeSecretKey);
```

---


# Frontend Documentation

1. [SearchBar](#searchbar)
2. [LoginPage](#login)
3. [RegisterForm](#register)
4. [Auth](#auth)
5. [Navbar](#navbar)
6. [ShopContext](#shopcontext)
7. [Admin](#admin)


### Searchbar

- In this file I´m using a input field where you can search for title, author or sort. I search through all the products and show them in their own cards on the page. If no products exist on the word you put in it will show *Inga produkter hittades*. I've split it so that the search function is in one file and the search result is in another, and the result itself is displayed on my category page. And when you have searched and found the articles you wanted to see (and the search box is empty) I check that *No products were found* as you have probably found what you are looking for

```
const SearchResultsList: React.FC<{
    products: Product[]
    searchPerformed: boolean
    searchTerm: string
}> = ({ products, searchPerformed, searchTerm }) => {}
```

Checking if the searchbar is empty

```
 const [searchPerformed, setSearchPerformed] = useState(false)
```

```
   const filterProducts = (searchTerm: string) => {
        setSearchPerformed(true)

        if (!searchTerm) {
            setSearchPerformed(false);
            onSearch([]); 
            return
        }

        const cleanedProducts = all_products.map((product) => {
            if (product._doc && product._doc.image) {
                const { image, ...restProduct } = product;
                return {
                    ...restProduct,
                    image: product._doc.image,
                };
            }
            return product;
        });

        const filtered = cleanedProducts.filter((product) => {
            const doc = product._doc || product

            const lowerCaseTerm = searchTerm.toLowerCase()

            const titleMatches = doc.title.toLowerCase().includes(lowerCaseTerm)
            const authorMatches = doc.author?.toLowerCase().includes(lowerCaseTerm) || false
            const sortMatches = doc.sort?.toLowerCase().includes(lowerCaseTerm) || false

            return titleMatches || authorMatches || sortMatches
        })

        setFilteredProducts(filtered)
        setSearchPerformed(true);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setInput(value)
        filterProducts(value)
    }
```

---

### Login

- This component handles the login by gathering the user's input --> send it to a server --> and if the login is successful, the user is navigated to homepage.

This is achieved via different functions that handle different states. Below is a general description of the code:

In the code, useState is imported, which is a React Hook to manage the component's state. The React library is used to build user interfaces. Link, useNavigate and useOutletContext are functions from react-router-dom that handle navigation and context within a router.

The ContextType interface also describes which context type exists for the onLogin function that takes in identifier (email or username), userId and token.

navigate navigates to another page.

onLogin is a function that is fetched from the Auth to handle login.

password and setPassword manage the state of the password data from the user.

loginIdentifier and setLoginIdentifier manage the state of the identifier data from the user (email or username).

In the LogoinForm component we also have functions such as handleInputChange which update the state of the loginIdentifier and password when the user enters email/ username or password.

The handleSubmit function handles the form input by sending the login credentials to the server via a POST request and processes the responses to login and navigate the user to the homepage.

The return shows the component's UI, i.e. User Interface, which is the form itself that the user sees in front of him/ her. It is for us developers, connected to a database that takes in the information from the user.

---

### Register

Like the previous form, this one also takes in various data from the user for registration.

In the `RegisterPage` component, we also have a `userData` and `setUserData` that manage the state of all data that contains the user's registration information.

The functions shown here include `handleInputChange` (updates `userData` when the user gives us a value in the text fields).

The function that handles the form's submission of data is `handleSubmit` which also, like `LoginForm`, sends all the data to the server via POST request and processes the responses to indicate whether the registration was successful or not.

In our return, which becomes the user's UI, we have a form that takes data such as `name`, `username`, `email` and `password`. The button to the form triggers the `handleSubmit` function.

Once this is done, we have a fully registered user in our database who is ready to login.

---

### Auth

AuthContext is a React context that handles the authentication logic of an application.
Here is a brief explanation of what it does:

1. Context definition: AuthContext is created with createContext and is used to store authentication status and related data such as email, user ID and token.

2. `AuthProvider`: This is a component that provides its subcomponents with authentication data and functions for logging in and logging out.
 * State management: `useState` is used to manage authentication state (isAuthenticated), identifier (email or username), user ID (userId) and token (token).
 * Local storage: On first rendering, `useEffect` retrieves any saved authentication data from `localStorage` and updates state if the user is logged in.
 * Login function: Updates state and `localStorage` with the user's email or username, ID and token when the user logs in.
 * Logout function: Clears state and `localStorage` when the user logs out.
3. `useAuth`: A custom `hook` that makes it easier for components to use the authentication context. It throws an error if used outside of `AuthProvider`.

In summary, AuthContext manages authentication state and user credentials and provides login and logout functionality, allowing the rest of the application to access this information in a simple and consistent manner.

Exampel of the use of useAuth in main.tsx:

```
interface ProtectedRouteProps {
    element: React.ReactElement
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const { isAuthenticated, token } = useAuth()

    if (isAuthenticated) {
        return element
    }
    if (token !== null) {
        return element
    }

    return <Navigate to="/login" />
}

const router = createBrowserRouter([
    {
        path: '/',
        element: (
            <>
                <App />
            </>
        ),
        children: [
            {
                path: '',
                element: <HomePage />,
            },
            {
                path: 'cafe',
                element: <CoffeePage />,
            },
            {
                path: 'garden/:id',
                element: <Product />,
            },
            {
                path: 'garden',
                element: <Category category="garden" banner={bannergarden} />,
            },
            {
                path: 'book',
                element: <Category category="book" banner={bannerbook} />,
            },
            {
                path: 'book/:id',
                element: <Product />,
            },
            {
                path: 'login',
                element: <Login />,
            },
            {
                path: 'register',
                element: <Register />,
            },
            {
                path: 'kundkorg',
                element: <ProtectedRoute element={ <Cart />} />,
            },
            {
                path: 'lyckadbetalning',
                element: <ProtectedRoute element={ <Success />} />,
            },
            {
                path: 'minsida',
                element: <ProtectedRoute element={ <User />} />,
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <AuthProvider>
        <ShopContextProvider>
            <RouterProvider router={router} />
        </ShopContextProvider>
    </AuthProvider>
)
```

---

### Navbar

Depending on the type of screen, I have either one or two dropdown menus.
Desktop: on desktop I use a dropdown to log in, log out and go to the user's profile page. Then I have the rest of the links lined up in the navbar.

Mobile: on mobile I use two different dropdown menus, one to log in, log out and go to the user's profile page, the other dropdown menu consists of all the links to the respective page.

The logo and which is in the middle of the navbar will take you to the home page if you click on it.

I use different useState to see if the menus are open or closed.

I also have my cart (which takes you to your cart) connected to the ShopContext so that every time you add or remove a product, the number of products in your cart changes.

The login icon is either a fontawesome icon or the user's own profile picture (the user cannot currently change it himself)

I use Link fron react-router-dom.

Navbar desktop:

![Desktop](/DocumentationImages/navbar_desktop.png)

Navbar mobile:

![Mobile](/DocumentationImages/navbar_mobile.png)

Dropdown login:

![Login](/DocumentationImages/login_dropdown.png)

Dropdown links:

![Links](/DocumentationImages/mobile_dropdown.png)

---

### ShopContext

In my ShopContext, I manage most things related to my products and my shopping cart.

I use createContext from React that handles the ShopContext logic in my application. createContext lets components pass information deep down without explicitly passing props. Call createContext outside any components to create one or more contexts.

```
interface ShopContextType {
    all_products: Product[]
    cartItems: CartItem[]
    addToCart: (productId: number, objectId: string) => void
    removeFromCart: (itemId: string) => void
    updateCartQuantity: (itemId: string, quantity: number) => void
    getTotalCartAmount: () => number
    getTotalCartItems: () => number
    clearCart: () => void
    loading: boolean
}

export const ShopContext = createContext<ShopContextType>({
    all_products: [],
    cartItems: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateCartQuantity: () => {},
    getTotalCartAmount: () => 0,
    getTotalCartItems: () => 0,
    clearCart: () => {},
    loading: false,
})
```

Then I only need to call the functions i need in createContext like this:

```
const { getTotalCartAmount, removeFromCart} = useContext(ShopContext)
```

I use UseEffect to retrieve products and shopping cart.

```
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${BASE_URL}/produkter`)
                if (!response.ok) throw new Error('Något gick fel vid hämtning av produkterna')
                const data = await response.json()
                setAll_products(data.products || [])
            } catch (error: any) {
                console.error('Error fetching products:', error)
            } finally {
                setLoading(false)
            }
        }

        const fetchCartItems = async () => {
            if (isAuthenticated) {
                const token = localStorage.getItem('token')
                try {
                    const response = await fetch(`${BASE_URL}/kundkorg/checkout`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                    if (!response.ok) throw new Error('Något gick fel vid hämtning av kundvagnen')
                    const data = await response.json()
                    setCartItems(data)
                } catch (error: any) {
                    console.error('Error fetching cart items:', error)
                } finally {
                    setLoading(false)
                }
            } else {
                setLoading(false)
            }
        }

        fetchProducts()
        fetchCartItems()
    }, [isAuthenticated])
```

In order to retrieve and update my shopping cart (add or remove products) I use useState.

In my *getTotalCartAmount*, I go through all the products I have in my shopping cart, then check the price and number of all products.

```
    const getTotalCartAmount = () => {
        let totalAmount = 0

        cartItems.forEach((cartItem) => {
            const product = all_products.find((p) => p._doc?.id === Number(cartItem.id))

            if (product) {
                if (typeof product._doc?.price === 'number') {
                    const quantity = cartItem.quantity

                    if (typeof quantity === 'number') {
                        totalAmount += product._doc.price * quantity
                    } else {
                        console.warn(`Invalid quantity for cartItem with id: ${cartItem.id}`)
                    }
                }
            } else {
                console.warn(`Product not found for cartItem with id: ${cartItem.id}`)
            }
        })

        return totalAmount
    }
```

In order for all of this to work, I need to use my ShopContextProvider around my route so that if you change pages, the data is not lost.

```
    <AuthProvider>
        <ShopContextProvider>
            <RouterProvider router={router} />
        </ShopContextProvider>
    </AuthProvider>
```


---

### Admin

In my admin page I use the same structure as in my webshop when it comes to *login*, *user registration*, *navbar* (only has the login dropdown) and *auth*.

An admin has the ability to create, read, update and delete users.

Admin can also create, read, update and delete products.

---

Create product:
In the code, useState is imported, which is a React Hook to manage the component's state. The React library is used to build user interfaces.

In the AddProduct component we also have functions such as handleInputChange which update the state of the product when the admin enters title, author / sort (depending on category), category, image, description and price.

```
const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, type } = event.target;
  
    const input = event.target as HTMLInputElement;
  
    if (type === "file" && input.files) {
      if (input.files.length > 0) {
        const file = input.files[0];
        setProductData((prevFormData) => ({
          ...prevFormData,
          [name]: file, 
        }));
        setSelectedFileNames([file.name]);
      }
    } else if (name === "price") {
      const priceValue = parseFloat(event.target.value);
      setProductData((prevFormData) => ({
        ...prevFormData,
        [name]: priceValue,
      }));
    } else {
      const value = event.target.value;
      setProductData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };
```

The handleSubmit function handles the form input by sending the product credentials to the server via a POST request and processes the responses to the product and navigates the user to the homepage.

```
 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formDataToSend = new FormData();

    Object.keys(productData).forEach((key) => {
      if (key !== "image") {
        const value = productData[key as keyof IFormData];
        formDataToSend.append(
          key,
          typeof value === "number" ? value.toString() : value || ""
        );
      }
    });

    if (productData.image) {
      formDataToSend.append("image", productData.image);
    }

    const token = localStorage.getItem("token");

    fetch(`${BASE_URL}/skapa`, {
      method: "POST",
      body: formDataToSend,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.success) {
          setProductStatus("success");
          window.alert(
            "Woho, produkt är nu skapad och du dirigeras till förstasidan!"
          );
          navigate("/");
        } else {
          setProductStatus("error");
          window.alert("Produkt är inte skapad. Var god försök igen.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        window.alert("Produkt är inte skapad. Var god försök igen.");
      });
  };

```

---

ProductList:

In my product list component, I can create, read, update and delete products.

I use useEffect from react to fetch all my products (I use this in my webshop to show all my product for the user)

```
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BASE_URL}/produkter`);
        if (!response.ok) {
          throw new Error("Något gick fel vid hämtning av produkterna");
        }
        const data = await response.json();
        setProducts(data.products);

      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
```

with *map* I go through my products to be able to see which category they belong to to be able to filter if I want to see all categories or only a specific one.

```
const categories = Array.from(new Set(products.map((product) => product._doc.category)));
```

To update a product I use Modal from react-modal. Here I use a PUT request that is sent to my backend to update the product. I use the id to update the correct product from my page and the database.

```
  const openModal = (product: IProduct) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleUpdate = (updatedProduct: IProductData) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._doc.id === updatedProduct.id
          ? { ...product, ...updatedProduct }
          : product
      )
    );
    closeModal();
  };
```

And to delete a product I use a delete request. I use the id to remove the correct product from my page and the database

```
 const removeFromList = async (id: number) => {
    const confirmed = window.confirm(
      "Är du säker på att du vill radera produkten?"
    );
    if (!confirmed) {
      return;
    }

    if (!isAuthenticated) {
      alert("Du måste vara inloggad för att ta bort en produkt.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._doc.id !== id)
        );

        window.alert("Produkten har blivit borttaget.");

        localStorage.removeItem("id");
        localStorage.removeItem("token");
      } else {
        throw new Error("Lyckades inte radera produkt");
      }
    } catch (error) {
      console.error("Update user data error:", error);
    }
  };
```