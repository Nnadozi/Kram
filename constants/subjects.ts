// Academic subjects for group creation

export const subjects = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Engineering',
  'Statistics',
  'Economics',
  'Business',
  'Psychology',
  'Sociology',
  'History',
  'Literature',
  'Philosophy',
  'Political Science',
  'Geography',
  'Art',
  'Music',
  'Theater',
  'Languages',
  'Medicine',
  'Nursing',
  'Law',
  'Education',
  'Architecture',
  'Environmental Science',
  'Astronomy',
  'Geology',
  'Anthropology',
  'Linguistics',
  'Journalism',
  'Communications',
  'Marketing',
  'Finance',
  'Accounting',
  'Management',
  'International Relations',
  'Public Health',
  'Social Work',
  'Criminology',
  'Religious Studies',
  'Classics',
  'Archaeology',
  'Dance',
  'Film Studies',
  'Graphic Design',
  'Photography',
  'Sports Science',
  'Nutrition'
]

export const searchSubjects = (query: string): string[] => {
  if (!query.trim()) return []
  
  const searchTerm = query.toLowerCase()
  return subjects.filter(subject => 
    subject.toLowerCase().includes(searchTerm)
  )
}
