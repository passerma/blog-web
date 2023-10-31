import Fetch from "utils/fetch";

export type BlogListType = {
  count: number
  blogs: {
    id: number
    title: string
    text: string
    created_at: number
    bgurl: string
    class: string
    look: string
  }[]
};

export function GetBlogList(params: any) {
  return Fetch<BlogListType>('/blog/list', { params })
}

export async function GetBlogLook() {
  return await Fetch<{ id: number, look: number }[]>('blog/look')
}
