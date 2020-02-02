//@flow
import React, { Component } from 'react';
import { TreeSelect } from 'antd';
const { TreeNode } = TreeSelect;

export const renderTree = (value: Object, parent: Object) => {
	try {
		if (!value.children) {
			return (
				<TreeNode value={String(value.value)} title={value.title} key={String(value.value)} />
			);
		}
		return (
			<TreeNode
				parent={parent}
				value={String(value.value)}
				title={value.title}
				key={String(value.value)}
			>
				{value.children.map(item => renderTree(item, value))}
			</TreeNode>
		);
	} catch (error) {
		console.log(error);
	}
};