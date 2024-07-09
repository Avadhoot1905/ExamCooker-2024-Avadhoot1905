"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { createForumPost } from '../actions/CreateForumPost';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { getTags } from '../actions/fetchTags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CreateForum: React.FC = () => {

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [slot, setSlot] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [filteredTags, setFilteredTags] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const forumId = "cly4bhnc0000df02z5tshuhx7";

  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const years = ['2020', '2021', '2022', '2023', '2024'];
  const slots = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2'];

  const filterYearAndSlot = (tags: string[], years: string[], slots: string[]) => {
    const yearRegex = /^(2\d{3}|3000)$/;
    return tags.filter(tag => !yearRegex.test(tag) && !slots.includes(tag));
  };

  useEffect(() => {
    async function fetchTags() {
      try {
        const fetchedTags = await getTags();
        const filteredTags = filterYearAndSlot(fetchedTags, years, slots);
        setAvailableTags(filteredTags);
        setFilteredTags(filteredTags);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    }
    fetchTags();
  }, []);

    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const years = ['2020', '2021', '2022', '2023', '2024'];
    const slots = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2', 'E1', 'E2', 'F1', 'F2', 'G1', 'G2'];

    const filterYearAndSlot = (tags: string[], years: string[], slots: string[]) => {
        const yearRegex = /^(2\d{3}|3000)$/;
        return tags.filter(tag => !yearRegex.test(tag) && !slots.includes(tag));
    };

    useEffect(() => {
        async function fetchTags() {
            try {
                const fetchedTags = await getTags();
                const filteredTags = filterYearAndSlot(fetchedTags, years, slots);
                setAvailableTags(filteredTags);
                setFilteredTags(filteredTags);
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        }
        fetchTags();
    }, []);

    const fuse = useMemo(() => new Fuse(availableTags, {
        threshold: 0.6,
        minMatchCharLength: 2,
    }), [availableTags]);


    const result = await createForumPost({ title, forumId, description, year, slot, selectedTags });
    if (result.success) {
      console.log('New forum post created: ', result.data);
      setIsSuccess(true);
    } else {
      console.error("Error: ", result.error);
    }
  };

  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewTag(value);
    setShowDropdown(true);
    if (value) {
      const results = fuse.search(value);
      const filteredResults = filterYearAndSlot(results.map(result => result.item), years, slots);
      setFilteredTags(filteredResults);
    } else {
      setFilteredTags(filterYearAndSlot(availableTags, years, slots));
    }
  };


            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await createForumPost({ title, authorId, forumId, description, year, slot, selectedTags });
        if (result.success) {
            console.log('New forum post created: ', result.data);
            setIsSuccess(true);
        } else {
            console.error("Error: ", result.error);
        }
    };

    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewTag(value);
        setShowDropdown(true);
        if (value) {
            const results = fuse.search(value);
            const filteredResults = filterYearAndSlot(results.map(result => result.item), years, slots);
            setFilteredTags(filteredResults);
        } else {
            setFilteredTags(filterYearAndSlot(availableTags, years, slots));
        }
    };

    const handleTagSelect = (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setNewTag('');
        setIsAddingTag(false);
        setShowDropdown(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (newTag && !selectedTags.includes(newTag)) {
                setSelectedTags([...selectedTags, newTag]);
                if (!availableTags.includes(newTag)) {
                    setAvailableTags([...availableTags, newTag]);
                }
                setNewTag('');
                setIsAddingTag(false);
                setShowDropdown(false);
            }
        }
    };

    const handleRemoveTag = (tag: string) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    if (isSuccess) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="p-6 shadow-lg">
                    <p className="text-green-600 font-bold text-xl">Forum post successfully created!</p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex justify-center items-center min-h-screen text-black dark:text-[#D5D5D5]">
            <div className=" bg-white dark:bg-[#0C1222] p-6 shadow-lg w-full max-w-md border-dashed border-2 border-[#D5D5D5]">
                <div className="flex justify-between items-center mb-4">
                    <Link href={'/forum'}>
                        <button className="text-[#3BF3C7] px-2 py-2 border-2 border-[#3BF3C7] flex items-center justify-center font-bold hover:bg-[#ffffff]/10">
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                    </Link>
                    <h3>New Post</h3>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-black dark:bg-[#3BF4C7]" />
                        <div className="dark:absolute dark:inset-0 dark:blur-[75px] dark:lg:bg-none lg:dark:group-hover:bg-[#3BF4C7] transition dark:group-hover:duration-200 duration-1000" />
                        <button type="submit" onClick={handleSubmit} className="dark:text-[#D5D5D5] dark:group-hover:text-[#3BF4C7] dark:group-hover:border-[#3BF4C7] dark:border-[#D5D5D5] dark:bg-[#0C1222] border-black border-2 relative px-4 py-2 text-lg bg-[#3BF4C7] text-black font-bold group-hover:-translate-x-1 group-hover:-translate-y-1 transition duration-150">
                            Post
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className='w-full'>
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className={`p-2 border-2 border-dashed dark:bg-[#0C1222] border-gray-300 w-full text-black dark:text-[#D5D5D5] text-lg font-bold`}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 place-content-center">
                        <div>
                            <select
                                className="p-2 w-full bg-[#5FC4E7] dark:bg-[#008A90] cursor-pointer transition-colors duration-300 hover:bg-opacity-85"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                            >
                                <option value="">Year</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                className="p-2 w-full bg-[#5FC4E7] dark:bg-[#008A90] cursor-pointer transition-colors duration-300 hover:bg-opacity-85"
                                value={slot}
                                onChange={(e) => setSlot(e.target.value)}
                                required
                            >
                                <option value="">Slot</option>
                                {slots.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <textarea
                            placeholder="Thread Description"
                            className={`p-2 border-2 border-dashed border-gray-300 bg-white dark:bg-[#0C1222] w-full  text-sm min-h-[150px]`}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <div className="flex items-center mb-2 flex-wrap">
                            {selectedTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-block bg-white dark:bg-[#3F4451] px-3 py-1 text-xs font-semibold mr-2 mb-2"
                                >
                                    #{tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-2 text-red-500"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Add tag"
                                    className={`p-2 border-2 border-dashed border-gray-300 w-full dark:bg-[#0C1222] text-lg font-bold`}
                                    value={newTag}
                                    onChange={handleTagInputChange}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                />
                                {showDropdown && (
                                    <div ref={dropdownRef} className="absolute z-10 mt-1 w-full bg-white dark:bg-[#232530] shadow-lg max-h-60 py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                        {filteredTags.map((tag) => (
                                            <div
                                                key={tag}
                                                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-[#ffffff]/10"
                                                onClick={() => handleTagSelect(tag)}
                                            >
                                                {tag}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );

};

export default CreateForum;
