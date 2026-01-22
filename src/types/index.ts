// Profile data type from GAS API
export interface Profile {
  id: number;
  name: string;
  role: string;
  hitokoto: string; // 一言
  now: string; // 今やっていること
  topic: string; // 最近のトピック
  core: string; // 大切にしていること/言葉
}

// API Response type
export interface ApiResponse {
  success: boolean;
  data: Profile[];
  error?: string;
}
