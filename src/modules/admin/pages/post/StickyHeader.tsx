import React, { useContext, useState } from 'react'
import BooleanContext from '../../layout/context/ExpandContext';
import { cn } from '@/lib/utils';
import HouseIcon from '@/assets/icons/HouseIcon';
import CaretRight from '@/assets/icons/CaretRight';
import { Link } from 'react-router-dom';
import PenIcon from '@/assets/icons/PenIcon';
import DotIcon from '@/assets/icons/Dot';
import HeaderLinks from '../../layout/navbar/Links';

type Props = {}

const PostHeader = (props: Props) => {
  const { isExpand, setIsExpand } = useContext(BooleanContext);

  const [isEdit, setIsEdit] = useState(false);

  return (
    <div
      className={cn('w-full flex px-8 py-2 flex-col gap-[10px] fixed top-0 right-0 z-10 border-b-[1px] border-l-[1px] min-h-[140px] bg-white border-[#E2E8F0]',
        isExpand ? 'w-[calc(100%-300px)]' : 'w-[calc(100%-120px)]')
      }
    >
      <div className='flex items-start flex-col gap-[10px] mt-1'>
        <div className='flex items-center gap-[10px]'>
          <HouseIcon />
          <CaretRight />
          <Link to='/admin/posts' className='text-[16px] font-bold text-[#475569]'>Quản lý bài viết</Link>
          <CaretRight />
          <span className='text-[16px] font-bold text-[#4F46E5]'>Chỉnh sửa bài viết</span>
        </div>
      </div>
      <div className='flex items-start gap-[16px] flex-col'>
        <div className='flex items-center gap-[10px]'>
          <div
            contentEditable={isEdit}
            className={cn('text-black text-[38px] font-bold outline-none', isEdit && 'outline-none')}
            onBlur={() => setIsEdit(false)}
          >
            Untitled
          </div>
          <PenIcon className='cursor-pointer' onClick={() => setIsEdit(!isEdit)} />
        </div>
        <div className='flex items-center gap-[10px]'>
          <span className='text-[#475569] text-[16px]'>19 Tháng 07, 2024</span>
          <DotIcon />
          <span className='text-[#475569] text-[16px]'>10:00 PM</span>
        </div>
      </div>
      <div className='absolute right-2 top-2'>
        <HeaderLinks onOpen={() => { }} fixed={true} />
      </div>
    </div>
  )
}

export default PostHeader