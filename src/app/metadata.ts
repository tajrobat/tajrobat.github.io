export const defaultMetadata = {
  title: " تجربت | تجربیات کاری در شرکت‌های ایرانی",
  description:
    "مرجع جامع تجربیات کاری، مصاحبه‌های شغلی و نظرات کارمندان درباره شرکت‌های ایرانی",
  keywords:
    "تجربه کاری، مصاحبه شغلی، شرکت‌های ایرانی، حقوق و دستمزد، فرصت‌های شغلی",
};

export const generateCompanyMetadata = (company: any) => ({
  title: `${company.name} | نظرات و تجربیات کارمندان | تجربت`,
  description: `تجربیات کاری، مصاحبه‌های شغلی و نظرات کارمندان درباره ${company.name}. میانگین حقوق، امتیاز ${company.rate} از ۵، و ${company.total_review} نظر ثبت شده.`,
  keywords: `${company.name}, تجربه کار در ${company.name}, مصاحبه ${company.name}, حقوق ${company.name}`,
});
