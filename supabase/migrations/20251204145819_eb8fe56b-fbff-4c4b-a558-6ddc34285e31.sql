-- Update the handle_new_user function to use the new default avatar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'username', SPLIT_PART(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'full_name',
    '/default-avatar.jpg'
  );
  RETURN new;
END;
$$;