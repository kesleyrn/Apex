/** An image in the form: either already stored (file = null) or newly picked and not uploaded yet. */
export type PickedImage = { id: string; url: string; path: string | null; file: File | null };
