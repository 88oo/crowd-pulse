import supabase, {supabaseUrl} from "./supabase";

export async function logindb({email, password}) {
    const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw new Error(error.message);
    
    return data;
}

export async function getCurrentUser() {
    const { data: session, error } = await supabase.auth.getSession();
    if (!session.session) return null;
    if (error) throw new Error(error.code.message);
    return session.session?.user;
}

export async function signupdb({name, email, password, profile_pic}) {
    const fileName = `pfp-${name.split(" ").join("_")}-${Math.random().toString(36).substring(2,9)}`;
  
    const {error: storageError} = await supabase.storage
      .from("profile_pic")
      .upload(fileName, profile_pic);
    
    if (storageError) throw new Error(storageError.message);

    const {data, error} = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
        },
      },
    });
  
    if (error) throw new Error(error.message);
  
    return data;
  }

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
}