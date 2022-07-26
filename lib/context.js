import { createContext } from "react";

//React Context API allows you to scope a value from the component tree,
//and then use that value anywhere in its children even if they're
//separated by multiple levels of components. since we'll be using the user/username
//data across multiple components, this is helpful to set up here.

export const UserContext = createContext({ user: null, username: null });
