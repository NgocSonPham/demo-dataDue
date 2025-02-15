import React, { useContext, useEffect, useRef, useState } from 'react';
import BooleanContext from '../../layout/context/ExpandContext';
import { cn } from '@/lib/utils';
import HouseIcon from '@/assets/icons/HouseIcon';
import CaretRight from '@/assets/icons/CaretRight';
import { Link } from 'react-router-dom';
import PenIcon from '@/assets/icons/PenIcon';
import DotIcon from '@/assets/icons/Dot';
import HeaderLinks from '../../layout/navbar/Links';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setPostDetail } from './postDetailSlice';
import formatDateTime from '@/utils/dateTime';
import InputAutoWidth from '@/components/InputAutoWidth';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const PostHeader = () => {
  const { isExpand } = useContext(BooleanContext);
  const postDetail = useAppSelector((state) => state.postDetail);
  const dispatch = useAppDispatch();

  const [isEdit, setIsEdit] = useState(false);
  const [title, setTitle] = useState(postDetail.title);
  const [debouncedTitle] = useDebouncedValue(title, 1000);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleEdit = () => {
    setIsEdit(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    console.log('debouncedTitle', debouncedTitle);
    dispatch(setPostDetail({ title: debouncedTitle }));
  }, [debouncedTitle]);

  useEffect(() => {
    setTitle(postDetail.title);
  }, [postDetail.title]);


  return (
    <div
      className={cn(
        'w-full flex px-8 py-2 flex-col gap-[10px] fixed top-0 right-0 z-10 border-b-[1px] border-l-[1px] min-h-[140px] bg-white border-[#E2E8F0]',
        isExpand ? 'w-[calc(100%-300px)]' : 'w-[calc(100%-120px)]'
      )}
    >
      <div className='flex items-start flex-col gap-[10px] mt-1'>
        <div className='flex items-center gap-[10px]'>
          <HouseIcon />
          <CaretRight />
          <Link to='/admin/posts' className='text-[16px] font-bold text-[#475569]'>
            Quản lý bài viết
          </Link>
          <CaretRight />
          <span className='text-[16px] font-bold text-[#4F46E5]'>Chỉnh sửa bài viết</span>
        </div>
      </div>
      <div className='flex items-start gap-[16px] flex-col'>
        <div className='flex items-center gap-[10px]'>
          <InputAutoWidth
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Untitled'
            disabled={!isEdit}
            maxLength={500}
            visibleCharacters={150}
          />
          <PenIcon className='cursor-pointer' onClick={handleEdit} />
        </div>
        {postDetail.createdAt && (
          <div className='flex items-center gap-[10px]'>
            <span className='text-[#475569] text-[16px]'>{formatDateTime(postDetail.createdAt)?.[0]}</span>
            <DotIcon />
            <span className='text-[#475569] text-[16px]'>{formatDateTime(postDetail.createdAt)?.[1]}</span>
          </div>
        )}
      </div>
      <div className='absolute right-2 top-2'>
        <HeaderLinks onOpen={() => { }} fixed={true} />
      </div>
    </div>
  );
};

export default PostHeader;
