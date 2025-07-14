export default function Loading() {
  return (
    <div
      className='flex flex-col gap-12 text-neutral-900 mx-auto animate-pulse'
      style={{
        paddingInline: 'clamp(16px, 11.84vw - 30.55px, 140px)',
        paddingTop: 'clamp(88px, calc(2.69rem + 5.35vw), 128px)',
      }}
    >
      <div className='h-8 bg-neutral-200 rounded w-3/4'></div>

      <div className='flex gap-8'>
        <div className='h-7 bg-neutral-200 rounded w-16'></div>
        <div className='h-7 bg-neutral-200 rounded w-20'></div>
        <div className='h-7 bg-neutral-200 rounded w-14'></div>
      </div>

      <div className='flex items-center justify-start gap-8 border-b border-neutral-300 pb-12'>
        <div className='w-30 h-30 bg-neutral-200 rounded-full'></div>
        <div className='h-4 bg-neutral-200 rounded w-24'></div>
        <div className='w-1 h-1 bg-neutral-200 rounded-full'></div>
        <div className='h-4 bg-neutral-200 rounded w-20'></div>
      </div>

      <div className='flex items-center justify-start gap-8 border-b border-neutral-300 pb-12'>
        <div className='w-5 h-5 bg-neutral-200 rounded'></div>
        <div className='h-4 bg-neutral-200 rounded w-8'></div>
        <div className='w-5 h-5 bg-neutral-200 rounded'></div>
        <div className='h-4 bg-neutral-200 rounded w-8'></div>
      </div>

      <div className='w-full h-64 bg-neutral-200 rounded'></div>

      <div className='space-y-3'>
        <div className='h-4 bg-neutral-200 rounded w-full'></div>
        <div className='h-4 bg-neutral-200 rounded w-full'></div>
        <div className='h-4 bg-neutral-200 rounded w-3/4'></div>
        <div className='h-4 bg-neutral-200 rounded w-full'></div>
        <div className='h-4 bg-neutral-200 rounded w-2/3'></div>
      </div>

      <hr />

      <div className='flex flex-col gap-6'>
        <div className='h-6 bg-neutral-200 rounded w-32'></div>

        <div className='flex items-center gap-4'>
          <div className='w-40 h-40 bg-neutral-200 rounded-full'></div>
          <div className='h-4 bg-neutral-200 rounded w-16'></div>
        </div>

        <div className='h-24 bg-neutral-200 rounded w-full'></div>

        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='flex flex-col gap-4 border-t border-neutral-300 pt-6'
          >
            <div className='flex gap-4 items-start'>
              <div className='w-40 h-40 bg-neutral-200 rounded-full'></div>
              <div className='flex flex-col gap-2'>
                <div className='h-4 bg-neutral-200 rounded w-20'></div>
                <div className='h-3 bg-neutral-200 rounded w-16'></div>
              </div>
            </div>
            <div className='h-4 bg-neutral-200 rounded w-full'></div>
          </div>
        ))}
      </div>
    </div>
  );
}
