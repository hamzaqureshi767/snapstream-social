-- Drop the recursive policy
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON public.conversation_participants;

-- Create a simple non-recursive policy - users can view their own participation records
CREATE POLICY "Users can view their own participations"
ON public.conversation_participants
FOR SELECT
USING (user_id = auth.uid());

-- Create a security definer function to check if user is in a conversation
CREATE OR REPLACE FUNCTION public.is_conversation_participant(conv_id uuid, uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conv_id AND user_id = uid
  );
$$;

-- Allow users to view other participants in conversations they belong to
CREATE POLICY "Users can view other participants in their conversations"
ON public.conversation_participants
FOR SELECT
USING (public.is_conversation_participant(conversation_id, auth.uid()));