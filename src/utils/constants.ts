export const DB_STORE_NAME = "sd";
export const PAGE_ITEMS = 10;
export const CONVERSATION_STATUS = {
  NEW: "new",
  READ: "read",
  UNREAD: "unread",
};

export const USER_ROLE = {
  ADMIN: "admin",
  CREATOR: "creator",
  GUEST: "guest",
};

export const LANGUAGES = [
  { label: "English", code: "en" },
  { label: "Tiếng Việt", code: "vi" },
];

export const TRAINING_TYPE = [
  {
    label: "Cao đẳng",
    value: "college",
  },
  {
    label: "Đại học",
    value: "university",
  },
  {
    label: "Học viện",
    value: "academy",
  },
  {
    label: "Viện nghiên cứu",
    value: "institute",
  },
];

export const TRAINING_MODEL = [
  {
    label: "Công lập",
    value: "public",
  },
  {
    label: "Tư thục",
    value: "private",
  },
  {
    label: "Nước ngoài",
    value: "foreign",
  },
  {
    label: "Dân lập",
    value: "independent",
  },
];

export const LIST_MAJOR_LABEL = {
  nghiepVu: "Nghiệp vụ",
  xaHoi: "Xã hội",
  nghienCuu: "Nghiên cứu",
  ngheThuat: "Nghệ thuật",
  quanLy: "Quản lý",
  kyThuat: "Kỹ thuật",
};

export const ORGANIZATION_MODEL = {
  public: "công lập",
  private: "tư thục",
  foreign: "nước ngoài",
  independent: "dân lập",
};

export const SUBJECT_LEVEL = [
  {
    id: "veryhard",
    iconName: "MdKeyboardDoubleArrowUp",
    iconColor: "#c0392b",
    title: "Very Hard",
  },
  {
    id: "hard",
    iconName: "MdKeyboardControlKey",
    iconColor: "#f1c40f",
    title: "Hard",
  },
  {
    id: "medium",
    iconName: "MdHorizontalRule",
    iconColor: "#2980b9",
    title: "Medium",
  },
  {
    id: "easy",
    iconName: "MdKeyboardDoubleArrowDown",
    iconColor: "#2ecc71",
    title: "Easy",
  },
];

export const SUBJECT_TYPE = [
  { id: "bat-buoc", title: "Bắt buộc" },
  { id: "tu-chon", title: "Tự chọn" },
  { id: "hoc-phan-thay-the", title: "Học phần thay thế" },
];

export const SUBJECT_GROUP = [
  { id: "hoc-phan-nen-tang", title: "Nền tảng", color: "#005569" },
  { id: "hoc-phan-nghiep-vu", title: "Nghiệp vụ" },
  { id: "hoc-phan-thuc-hanh", title: "Thực hành, thực tập nghề nghiệp" },
  { id: "hoc-phan-tot-nghiep", title: "Tốt nghiệp", color: "#0561BE" },
  { id: "hoc-phan-co-so-nganh", title: "Cơ sở ngành" },
  { id: "hoc-phan-chuyen-nganh", title: "Chuyên ngành", color: "#8B257E" },
  { id: "hoc-phan-bo-tro", title: "Bổ trợ" },
  { id: "hoc-phan-giao-duc-dai-cuong", title: "Giáo dục đại cương" },
];

export const SUBJECT_MORE_INFO = [
  {
    id: "artice",
    iconName: "MdOutlineArticle",
    title: "Artice",
    color: "#FDE047",
  },
  {
    id: "video",
    iconName: "MdPlayCircleOutline",
    title: "Video",
    color: "#D8B4FE",
  },
  { id: "opensource", iconName: "MdCode", title: "Opensource" },
  {
    id: "course",
    iconName: "MdOutlineSchool",
    title: "Course",
    color: "#2B78E4",
  },
  {
    id: "website",
    iconName: "MdOutlineBlurCircular",
    title: "Website",
  },
  { id: "podcast", iconName: "MdMicNone", title: "Podcast", color: "#FF9E91" },
];
