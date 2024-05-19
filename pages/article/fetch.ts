import fetch from 'utils/fetch'

export type BlogListType = {
  count: number
  blogs: {
    id: number
    title: string
    text: string
    created_at: number
    bgurl: string
    class: string
    look: number
    beauti: number
  }[]
};

export type BlogComment = {
  to_user: string
  parent: string
  id: number
  user: string
  user_name: string
  comment: string
  comment_img: string
  avatar: string
  user_id: number | null
  location: string
  introduction: string
  created_at: string
  child: BlogComment[]
}

type BlogDetail = {
  beauti: number
  bgurl: string
  blog_type: number
  class: string
  collect_num: number
  comment_num: number
  content: string
  created_at: string
  deleted_at: string
  id: number
  is_top: number
  is_visible: number
  like_num: number
  look: number
  text: string
  title: string
  updated_at: string
}

type operateRes = {
  collect: number
  collectNum: number
  like: number
  likeNum: number
}

export async function GetBlogList(params: any) {
  const req = {
    method: 'get' as const,
    params: {
      beauti: 0,
      ...params
    }
  }
  return await fetch<BlogListType>('blog/list', req)
}

export async function GetBlogDetail(id: string) {
  const req = {
    method: 'get' as const
  }
  return await fetch<BlogDetail>(`blog/list/${id}`, req)
}

export async function GetBlogLook(id: string) {
  const req = {
    method: 'get' as const
  }
  return await fetch<{ id: number, look: number }[]>(`blog/look/${id}`, req)
}

export async function GetBlogComments(id: string) {
  const req = {
    method: 'get' as const
  }
  return await fetch<BlogComment[]>(`blog/comment/${id}`, req)
}

export async function PostBlogComments(id: string, data: any) {
  const req = {
    method: 'post' as const,
    data
  }
  return await fetch<BlogComment[]>(`blog/comment/${id}`, req)
}

export async function PutBlogComments(id: number, data: any) {
  const req = {
    method: 'put' as const,
    data
  }
  return await fetch<BlogComment[]>(`blog/comment/${id}`, req)
}

export async function DelBlogComment(id: number) {
  const req = {
    method: 'delete' as const
  }
  return await fetch<BlogComment[]>(`blog/comment/${id}`, req)
}

export async function PutLookRes(id: string) {
  return await fetch(`blog/look/${id}`, { method: 'PUT' })
}

export async function GetOperateRes(id: string) {
  return await fetch<operateRes>(`blog/operate/${id}`)
}

export async function PostBlogOperateRes(id: string, data: Record<string, boolean>) {
  return await fetch(`user/blog/operate/${id}`, {
    method: 'POST',
    data
  })
}