// Profile data type from GAS API
export interface Profile {
  id: number;
  name: string;
  role: string;
  hitokoto: string; // 一言
  now: string; // 今やっていること
  topic: string; // 最近のトピック
  core: string; // 大切にしていること/言葉
  ai_questions?: string; // AI生成の質問（JSON配列文字列）
}

// API Response type
export interface ApiResponse {
  success: boolean;
  data: Profile[];
  error?: string;
}

// 投票メンバー
export interface VoteMember {
  id: number;
  name: string;
}

// 投票ステータス値
export type VoteStatusValue = 1 | 2 | 3 | null; // 1:Go, 2:Maybe, 3:Home, null:未投票

// 投票状況
export interface VoteStatus {
  survivalRate: number; // 生存率（%）
  totalVoted: number; // 投票済み人数
  totalMembers: number; // 総メンバー数
  myStatus: VoteStatusValue; // 自分の投票状況
  goCount: number; // Go選択者数
  maybeCount: number; // Maybe選択者数
  homeCount: number; // Home選択者数
  goMembers: VoteMember[]; // Go選択者リスト
  maybeMembers: VoteMember[]; // Maybe選択者リスト
}

// 投票状況APIレスポンス
export interface VoteStatusResponse {
  success: boolean;
  data: {
    survival_rate: number;
    total_voted: number;
    total_members: number;
    my_status: VoteStatusValue;
    go_count: number;
    maybe_count: number;
    home_count: number;
    go_members: VoteMember[];
    maybe_members: VoteMember[];
  };
  timestamp?: string;
  error?: string;
}

// 投票APIレスポンス
export interface VoteResponse {
  success: boolean;
  message?: string;
  data?: {
    user_id: number;
    status: number;
    updated_at: string;
  };
  error?: string;
  code?: string;
}
